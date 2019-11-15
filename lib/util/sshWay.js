const chalk = require('chalk')
const readline = require('readline');
const node_ssh = require('node-ssh')
const ssh = new node_ssh()
const { log, warn, error } = require('../logger')

const resolveConfig = async (config, cb) => {
    const conf = {
        host: config.host,
        username: config.username,
        password: config.password,
        port: config.port || 22,
    }
    if (config.typingmode) {
        process.stdout.write(chalk.bgGrey.white.bold('You have selected typing mode.\n'));
        for (let key in conf) {
            if (!conf[key]) {
                process.stdout.write(`Please enter yours ${chalk.bold(key)}\n`);
                conf[key] = await stdinSync();
            }
        }
        cb(conf)
    }
}

const stdinSync = function (tips) {
    tips = tips || '>'
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(tips, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });

}

module.exports = function sshWay(sshConfig, buildFileDir) {
    resolveConfig(sshConfig, function (config) {
        ssh.connect(config).then(async () => {
            if (sshConfig.backups) {
                log(chalk.bold('Start file backup operation,the file list:'))
                const targetPath = sshConfig.targetPath
                const index = targetPath.lastIndexOf('\/') + 1
                const cwd = targetPath.substring(0, index)
                const dir = targetPath.substring(index)
                await ssh.execCommand(
                    `cd ${cwd} && ` +
                    `mv ${dir} ${dir}.bak && ` + 
                    `tar czvf ampc.bak.tar ${dir}.bak &&` + 
                    `rm -rf ${dir}.bak`
                    ).then(function (result) {
                        result.stdout && log(result.stdout + chalk.bold('\nThe backup to complete'))
                        result.stderr && warn(result.stderr)
                })
            }
            log(chalk.bold(`Start put Directory to ${chalk.cyan(sshConfig.host)}`))
            ssh.putDirectory(buildFileDir, sshConfig.targetPath, {
                recursive: true,
                concurrency: 10,
            }).then(function (status) {
                log(chalk.bold(`the directory transfer was ${status ? 'successful' : 'unsuccessful'}`))
                ssh.dispose()
            })
        }).catch(err => {
            error(
                `\n ssh connectError :` +
                `${err.stack}`
            )
        })
    })

}
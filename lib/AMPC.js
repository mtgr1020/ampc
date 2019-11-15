const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { log, error } = require('./logger')
const validateAmpcConfig = require('./util/validateAmpcConfig')
const backups = require('./util/backups')
const sshWay = require('./util/sshWay')

module.exports = class AMPC {
    constructor(context) {
        this.context = context
    }
    loadUserOptions() {
        let fileConfig
        const configPath = (
            process.env.AMPC_CLI_SERVICE_CONFIG_PATH ||
            path.resolve(this.context, 'ampc.config.js')
        )
        if (fs.existsSync(configPath)) {
            try {
                fileConfig = require(configPath)
                if (typeof fileConfig === 'function') {
                    fileConfig = fileConfig()
                }
                if (!fileConfig || typeof fileConfig !== 'object') {
                    error(
                        `Error loading ${chalk.bold('ampc.config.js')}: should export an object or a function that returns object.`
                    )
                    fileConfig = null
                }
            } catch (e) {
                error(`Error loading ${chalk.bold('ampc.config.js')}:`)
                throw e
            }
            this.fileConfig = fileConfig;
        } else {
            error(
                `You have to provide ${chalk.bold('ampc.config.js')} When using ampc-cli-service to build \n` +
                `File placement: ${this.context}/`
            )
        }
    }
    run() {
        this.loadUserOptions()
        try {
            validateAmpcConfig(this.fileConfig, this.context)
        } catch (e) {
            error(e.message)
            process.exit(1)
        }
        if (this.fileConfig.localConfig && this.fileConfig.localConfig.targetPath){
            this.targetPathCheck({
                srcPath: this.resolve([this.context, this.fileConfig.buildFileDir]),
                targetPath: this.resolve([this.context, this.fileConfig.localConfig.targetPath]),
                backupsFlag: true
            })
        }
        if (this.fileConfig.sshConfig){
            sshWay(this.fileConfig.sshConfig, this.fileConfig.buildFileDir)
        }
    }
    targetPathCheck({ srcPath, targetPath, backupsFlag }) {
        if (targetPath) {
            fs.access(targetPath, fs.constants.F_OK, async (err) => {
                if (err) {
                    fs.mkdirSync(targetPath, { recursive: true })
                } else {
                    if (backupsFlag && this.fileConfig.localConfig.backups) {
                        await backups(targetPath)
                    }
                }
                this.copySource(srcPath, targetPath)
            })
        }
    }
    resolve(pathList) {
        return path.resolve(...pathList);
    }
    copySource(srcPath, targetPath) {
        let paths = fs.readdirSync(srcPath)
        paths.forEach(path => {
            let _srcPath = this.resolve([srcPath, path])
            let _targetPath = this.resolve([targetPath, path])
            fs.stat(_srcPath, (err, stats) => {
                if (err) throw err
                if (stats.isFile()) {
                    let readerStream = fs.createReadStream(_srcPath)
                    let writerStream = fs.createWriteStream(_targetPath)
                    readerStream.pipe(writerStream)
                } else if (stats.isDirectory()) {
                    this.targetPathCheck({
                        srcPath: _srcPath,
                        targetPath: _targetPath
                    })
                }
            })
        })
    }
}
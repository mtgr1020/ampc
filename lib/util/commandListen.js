const child_process = require('child_process');
const { log } = require('../logger')
module.exports = function (commands=[]){
    let len = commands.length;
    return new Promise((resolve,reject)=>{
        if (len === 0){
            resolve()
        }
        commands.forEach(item => {
            log('> Ready to execute command - - -')
            const workerProcess = child_process.spawn(item.command, item.args)
            workerProcess.stdout.on('data', function (data) {
                console.log('> ' + data)
            });
            workerProcess.stderr.on('data', function (data) {
                console.error('> ' + data)
            });
            workerProcess.on('close', function (code) {
                if(--len === 0){
                    resolve()
                }
            });
        })
    })
}
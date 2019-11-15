const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

module.exports = function validateAmpcConfig (ampcConfig,context){
    if (!ampcConfig.buildFileDir){
        throw new Error(
            `\nConfiguration Error: ` + 
            `You must provide buildFileDir in ampc.config.js`
        )
    }
    
    if (!ampcConfig.commands) {
        fs.stat(path.resolve(context, ampcConfig.buildFileDir), function (err, stats) {
            if (err) {
                throw err.message
            }
        })
    }

    if (!ampcConfig.localConfig && !ampcConfig.sshConfig){
        throw new Error(
            `\nConfiguration Error: ` +
            `Please configure your localConfig or sshConfig in ampc.config.js`
        )
    }else{
        if (typeof ampcConfig.localConfig === 'string'){
            ampcConfig.localConfig = {
                targetPath: ampcConfig.localConfig
            }
        }
        if (ampcConfig.sshConfig && typeof ampcConfig.sshConfig !== 'object'){
            throw new Error(
                `\nConfiguration Error: ` +
                `sshConfig has to be a object, But we got ${chalk.bold(typeof ampcConfig.sshConfig)} type`
            )
        }
    }
}
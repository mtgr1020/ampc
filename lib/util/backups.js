const path = require('path')
const compressing = require('compressing');
const {  error } = require('../logger')

module.exports = function backups(_path){
    return new Promise(function (resolve, reject){
        compressing.tgz.compressDir(_path, path.join(_path,'..','ampc.backups.tgz'))
            .then(() => {
                resolve()
            })
            .catch(err => {
                error(err)
                reject(err)
            })
    })
}
'use strict'
/**
 * Created by betapcode on 12/19/17.
 * @author betapcode<betapcode@gmail.com>
 * @version 0.0.1
 * @copyright TamtayGlobal - Dark9 Team
 */
const Promise   = require("bluebird");
const fs        = require("fs"); //Load the filesystem module
const path      = require("path");

const utils     = module.exports;

utils.getFileInfo = function(filePath) {
    let info        = {};
    info.dirname    = path.dirname(filePath);
    info.basename   = path.basename(filePath);
    info.name       = info.basename.split('.')[0];
    info.extname    = path.extname(filePath);
    return info;
}

utils.getFilesizeInBytes = function(filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
}

utils.convertBytoToMb = function(number){
    return (number/1024/1024).toPrecision(2) + "Mb";
}

utils.readFileAsync = function(file, encoding, cb) {
    if (cb) return fs.readFile(file, encoding, cb)

    return new Promise(function (resolve, reject) {
        fs.readFile(function (err, data) {
        if (err) return reject(err)
        resolve(data)
        })
    })
}
'use strict'
/**
 * Created by betapcode on 12/19/17.
 * @author betapcode<betapcode@gmail.com>
 * @version 0.0.1
 * @copyright TamtayGlobal - Dark9 Team
 */

const tinify    = require("tinify");
const fs        = require("fs"); //Load the filesystem module
const utils     = require('./utils');
const Promise   = require("bluebird");
const path      = require("path");
const flags     = require('flags');

const config    = require('./config');

const maxSize   = config.maxSize; // 5MB
const maxCount  = config.maxSize; // tổng số lượt trên 1 tháng
tinify.key      = config.key;

let folder      = "images/";
let folderNew   = "images_optimized/";
let fileName    = folder + "anhgoc.jpg";
let fileNameNew = folderNew + "anhgoc_news2.jpg";

// console.log("[start] ");

flags.defineInteger('width', 0, 'Your width');
flags.defineInteger('height', 0, 'Your height');
flags.defineString('resize', 'fit','Your method resize');
flags.defineString('type', 'single', 'single');
flags.defineString('output', null, 'Save images to direct folders');
flags.defineString('path', null, 'path File');
flags.defineString("info", "info", 'View info');
flags.defineString("h", "help", 'Helper');
flags.parse();

let widthFlag   = flags.get('width'); // cờ xác định resize với tham số width
let heightFlag  = flags.get('height'); // cờ xác định resize với tham số height
let resizeFlag  = flags.get('resize');
let typeFlag    = flags.get('type');
let outputFlag  = flags.get('output');
let pathFile    = flags.get('path'); // đường dẫn file ảnh local
let infoFlag    = flags.get('info');
let helpFlag    = flags.get('h');

if (!infoFlag) {
    console.log("----------------------------------------------------------------");
    console.log("+ Version: 0.0.1");
    console.log("+ Author: betapcode@gmail.com");
    console.log("+ Copyright: TamtayGlobal - Dark9 Team");
    console.log("+ Description: Compress images from local with tinypng api");
    console.log("----------------------------------------------------------------");
    process.exit(-1);
}


// Xử lý khi gõ help
if (!helpFlag) {
    console.log("------------------------------------------------------------------------------------------");
    console.log("Usage:  ttcompress [options]\n");
    console.log("\tttcompress --path=<path file image> --output=<folded store> \n");
    console.log("Options:");
    console.log("\t --info \t Print ttcompress information");
    console.log("\t --h     \t Print ttcompress helper");
    console.log("\t --output \t Store directory");
    console.log("\t --path \t File path images in local");
    console.log("\t --type \t Type of process images: single or multi, default single");
    console.log("\t --resize \t Type of resize: fit, cover, scale");
    console.log("\t --width \t Width image");
    console.log("\t --height \t Height image");
    console.log("------------------------------------------------------------------------------------------");
    process.exit(-1);
}

let resizeState = false;

if (widthFlag !== 0 || heightFlag !== 0) {
    resizeState = true;
}

// console.log("widthFlag: ", widthFlag ," => heightFlag: ", heightFlag, " => resizeFlag: ", resizeFlag, " => resizeState: ", resizeState);
// console.log("outputFlag: ", outputFlag, " => path: ", pathFile);

if (typeFlag === "single" && !pathFile) {
    console.log("[error] Bạn chưa nhập đường dẫn ảnh !");
    process.exit(-1);
}

let folderOutPut = "";
if (outputFlag) {
    folderOutPut = outputFlag + "/";
}

let arrResize = {};
switch(resizeFlag) {
    case "cover":
        arrResize = {
            method: resizeFlag,
            width: (widthFlag) ? widthFlag : heightFlag,
            height: (heightFlag) ? heightFlag : widthFlag
        };
        break;
    case "fit":
        arrResize = {
            method: resizeFlag,
            width: (widthFlag) ? widthFlag : heightFlag,
            height: (heightFlag) ? heightFlag : widthFlag
        };
        break;
    case "scale":
        if (widthFlag != 0){
            arrResize = {
                method: resizeFlag,
                width: widthFlag
            };
        }else if(heightFlag != 0){
            arrResize = {
                method: resizeFlag,
                height: heightFlag
            };
        }
        break;
    default:
        arrResize = {
            method: resizeFlag,
            width: (widthFlag) ? widthFlag : heightFlag,
            height: (heightFlag) ? heightFlag : widthFlag
        };
}

let currentCount = 0;

tinify.validate(function(err) {
    if (err) throw err;
    // Validation of API key failed.

    // let compressionsThisMonth = tinify.compressionCount;
    // console.log("compressionsThisMonth: ", compressionsThisMonth);
    currentCount = tinify.compressionCount;
    console.log("- currentCount: ", currentCount);

    switch(typeFlag) {
        case "single":
            // nếu là scale: thì chỉ cần truyền vào 1 tham số là width or height
            // nếu là fit thì truyền vào cả 2 tham số width, height
            // nếu là cover thì truyền vào thế nào cả 2 tham số hoặc truyền vào 1 tham số, tham số còn lại lấy tương tự

            if (resizeState) {
                // thực hiện resize ảnh
                console.log("arrResize: ", arrResize);
                let source  = tinify.fromFile(pathFile); // , fileName
                let resized = source.resize(arrResize);
                resized.toFile(folderOutPut + "thumbnail_"+ resizeFlag +".jpg");

            }else{

                // Lấy thông tin của file
                let _info = utils.getFileInfo(pathFile);
                
                // Nếu nhập vào tham số --output thì lưu file mới vào đó, nếu không thì ghi đè vào file cũ
                let _newFile    = (outputFlag) ? outputFlag + "/" + _info.basename : pathFile; //folderNew + "/" + _info.basename;

                let source = tinify.fromFile(pathFile);
                source.toFile(_newFile, function(data){
                    if (!data) {
                        currentCount += 1;
                        console.log("---> currentCount: ", currentCount);
                        console.log("Done quá trình OldFileSize ", utils.getFilesizeInBytes(pathFile) ," => NewFileSize: ", utils.getFilesizeInBytes(_newFile));
                    }
                });
            }

            break;
        case "multi":
            // Đọc dữ liệu trong file
            utils.readFileAsync('abc.txt', 'utf8', function (er, data) {
                data.toString().split("\n").forEach(function(line, index, arr) {
                    if (index === arr.length - 1 && line === "") { return; }

                    currentCount += 1;

                    // Lấy thông tin của file 
                    let _info = utils.getFileInfo(line);
                    let _newFile    = (outputFlag) ? outputFlag + "/" + _info.basename : folderNew + "/" + _info.basename;
                    
                    if (currentCount < 500) {

                        let fileSize = utils.getFilesizeInBytes(fileName);

                        if (fileSize <= maxSize) {
                            
                            let source = tinify.fromFile(line);
                            source.toFile(_newFile, function(data){
                                // console.log("callback: ", data);
                                if (!data) {
                                    console.log(index + " " + line);
                                    console.log("---> currentCount: ", currentCount);
                                    console.log("Done quá trình OldFileSize ", utils.getFilesizeInBytes(line) ," => NewFileSize: ", utils.getFilesizeInBytes(_newFile));
                                }
                            });
                        }else{
                            console.log("[error] Vượt quá dung lượng cho phép ", maxSize);
                        }
                    }else{
                        console.log("[error] Vượt quá số lượng cho phép ", maxCount);
                    }

                });

            });// end doc du lieu tu file
            break;
        default:
            
    }    

    

});







// Example 1: default

// tinify.validate(function(err) {
//     if (err) throw err;
//     // Validation of API key failed.

//     let compressionsThisMonth = tinify.compressionCount;
//     console.log("compressionsThisMonth: ", compressionsThisMonth);

//     if (compressionsThisMonth < 500) {

//         let fileSize = utils.getFilesizeInBytes(fileName);

//         if (fileSize <= maxSize) {
            
//             let source = tinify.fromFile(fileName);
//             source.toFile(fileNameNew, function(data){
//                 console.log("callback: ", data);
//                 if (!data) {
//                     console.log("Done quá trình OldFileSize ", utils.getFilesizeInBytes(fileName) ," => NewFileSize: ", utils.getFilesizeInBytes(fileNameNew));
//                 }
//             });
//         }else{
//             console.log("Vượt quá dung lượng cho phép ", maxSize);
//         }
//     }else{
//         console.log("Vượt quá số lượng cho phép ", maxCount);
//     }

// });


"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressFiles = exports.getFilesfromRepo = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const getFilesfromRepo = (projectName, urls) => {
    const directory = path.join(__dirname.replace('src\\utils', 'temp'), projectName);
    const download = require('download');
    return new Promise((resolve, _reject) => {
        urls.forEach(async (url) => {
            await download(url.download_url, directory);
            console.log('File downloaded successfully!');
        });
        resolve(true);
    }).then(() => {
        return compressFiles(directory);
    });
};
exports.getFilesfromRepo = getFilesfromRepo;
const compressFiles = (directory) => {
    const zipCompress = require('adm-zip');
    const filePackage = new zipCompress();
    const zipDirectory = fs.readdirSync(directory);
    const downloadPackage = 'job_package.zip';
    for (const file of zipDirectory)
        filePackage.addLocalFile(path.join(directory, file));
    const data = filePackage.toBuffer();
    return { downloadFileName: downloadPackage, data };
};
exports.compressFiles = compressFiles;
//# sourceMappingURL=download.js.map
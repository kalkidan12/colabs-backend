"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCloudinary = exports.fileUploadMulter = exports.imageUploadMulter = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("cloudinary");
const imageStorage = multer_1.default.diskStorage({
    destination(_req, _file, cb) {
        const uploadPath = 'uploads/';
        !fs_1.default.existsSync(uploadPath) && fs_1.default.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename(_req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    },
});
const projectFilesTempStorage = multer_1.default.diskStorage({
    destination(_req, _file, cb) {
        const uploadPath = path_1.default.join('uploads', 'temp');
        !fs_1.default.existsSync(uploadPath) && fs_1.default.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename(_req, file, cb) {
        cb(null, file.originalname);
    },
});
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb(Error('Images only!'));
    }
}
const imageUploadMulter = (0, multer_1.default)({
    storage: imageStorage,
    fileFilter(_req, file, cb) {
        checkFileType(file, cb);
    },
});
exports.imageUploadMulter = imageUploadMulter;
const fileUploadMulter = (0, multer_1.default)({
    storage: projectFilesTempStorage,
});
exports.fileUploadMulter = fileUploadMulter;
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadCloudinary = async (p, folder) => {
    return new Promise((resolve) => {
        resolve(cloudinary_1.v2.uploader.upload(p, { folder }));
    });
};
exports.uploadCloudinary = uploadCloudinary;
//# sourceMappingURL=upload.js.map
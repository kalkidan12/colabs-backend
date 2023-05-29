import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';

const imageStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    const uploadPath = 'uploads/';
    !fs.existsSync(uploadPath) && fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename(_req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const projectFilesTempStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    const uploadPath = path.join('uploads', 'temp');
    !fs.existsSync(uploadPath) && fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename(_req, file, cb) {
    cb(null, file.originalname);
  },
});

/**
 * Check if a file type matches one of the expected extensions (images only)
 * @param file
 * @param cb
 */
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(Error('Images only!'));
  }
}

const imageUploadMulter = multer({
  storage: imageStorage,
  fileFilter(_req, file, cb) {
    checkFileType(file, cb);
  },
});

const fileUploadMulter = multer({
  storage: projectFilesTempStorage,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (p: string, folder: string) => {
  return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve) => {
    resolve(cloudinary.uploader.upload(p, { folder }));
  });
};
export { imageUploadMulter, fileUploadMulter, uploadCloudinary };

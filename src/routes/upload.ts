import { Request, Response } from '../types';
import express from 'express';
import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { uploadCloudinary, imageUploadMulter } from '../utils';
const router = express.Router();

const uploadController = asyncHandler(async (req: Request, res: Response) => {
  const uploader = async (p: string) => await uploadCloudinary(p, 'Images');

  const { file } = req;
  const localPath = path.join(path.resolve(), 'uploads');
  const remotePath = await uploader(`${localPath}/${file?.filename}`);
  const imgUrl = remotePath.secure_url;
  fs.unlinkSync(`${localPath}/${file?.filename}`);

  res.send(imgUrl);
});

router.post('/', imageUploadMulter.single('image'), uploadController);

export default router;

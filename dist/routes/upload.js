"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
const uploadController = (0, express_async_handler_1.default)(async (req, res) => {
    const uploader = async (p) => await (0, utils_1.uploadCloudinary)(p, 'Images');
    const { file } = req;
    const localPath = path_1.default.join(path_1.default.resolve(), 'uploads');
    const remotePath = await uploader(`${localPath}/${file === null || file === void 0 ? void 0 : file.filename}`);
    const imgUrl = remotePath.secure_url;
    fs_1.default.unlinkSync(`${localPath}/${file === null || file === void 0 ? void 0 : file.filename}`);
    res.send(imgUrl);
});
router.post('/', utils_1.imageUploadMulter.single('image'), uploadController);
exports.default = router;
//# sourceMappingURL=upload.js.map
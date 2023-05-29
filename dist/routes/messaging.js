"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messaging_1 = require("../controllers/messaging");
const router = express_1.default.Router();
router.route('/:userId').get(messaging_1.getMessages);
router.route('/lastSeen').post(messaging_1.getLastSeen);
exports.default = router;
//# sourceMappingURL=messaging.js.map
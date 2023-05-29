"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const methods_1 = require("./methods");
const notificationSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
notificationSchema.method(methods_1.modelMethods);
notificationSchema.static(methods_1.staticMethods);
exports.default = mongoose_1.default.model('Notification', notificationSchema);
//# sourceMappingURL=index.js.map
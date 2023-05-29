"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const methods_1 = require("./methods");
const chatSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
    },
    members: {
        type: [String],
        required: true,
    },
    totalMessages: {
        type: [Object],
    },
    inbox: {
        type: [Object],
    },
}, {
    timestamps: true,
});
chatSchema.method(methods_1.modelMethods);
chatSchema.static(methods_1.staticMethods);
exports.default = mongoose_1.default.model('Chat', chatSchema);
//# sourceMappingURL=index.js.map
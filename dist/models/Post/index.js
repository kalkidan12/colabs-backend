"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const methods_1 = require("./methods");
const postSchema = new mongoose_1.default.Schema({
    textContent: {
        type: String,
    },
    imageContent: {
        type: String,
    },
    likes: {
        type: [String],
    },
    tags: {
        type: [String],
    },
    comments: {
        type: [Object],
    },
    donatable: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
postSchema.method(methods_1.modelMethods);
postSchema.static(methods_1.staticMethods);
exports.default = mongoose_1.default.model('Post', postSchema);
//# sourceMappingURL=index.js.map
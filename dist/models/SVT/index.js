"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const methods_1 = require("./methods");
const svtSchema = new mongoose_1.default.Schema({
    skill: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    solution: {
        type: String,
        required: true,
    },
    requirements: {
        type: [String],
        default: [],
    },
    icon: {
        type: String,
    },
}, {
    timestamps: true,
});
svtSchema.method(methods_1.modelMethods);
svtSchema.static(methods_1.staticMethods);
exports.default = mongoose_1.default.model('SVT', svtSchema);
//# sourceMappingURL=index.js.map
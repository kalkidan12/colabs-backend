"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const methods_1 = require("./methods");
const repositorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    tasks: {
        type: [Object],
    },
    files: {
        type: [Object],
        default: [],
    },
    owner: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
repositorySchema.method(methods_1.modelMethods);
repositorySchema.static(methods_1.staticMethods);
exports.default = mongoose_1.default.model('Repository', repositorySchema);
//# sourceMappingURL=index.js.map
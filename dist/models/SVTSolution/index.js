"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const methods_1 = require("./methods");
const svtSolutionSchema = new mongoose_1.default.Schema({
    skillId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    solution: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        default: -1,
    },
    status: {
        type: String,
        default: 'Pending',
    },
}, {
    timestamps: true,
});
svtSolutionSchema.method(methods_1.modelMethods);
svtSolutionSchema.static(methods_1.staticMethods);
exports.default = mongoose_1.default.model('SVTSolution', svtSolutionSchema);
//# sourceMappingURL=index.js.map
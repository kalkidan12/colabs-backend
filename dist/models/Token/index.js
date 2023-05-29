"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const types_1 = require("../../types");
const methods_1 = require("./methods");
const tokenSchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    },
    user: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        default: types_1.TokenTypes.ACCESS,
        enum: Object.values(types_1.TokenTypes),
        required: true,
    },
    expires: {
        type: String,
        required: true,
    },
    blackListed: {
        type: Boolean,
        default: false,
    },
});
tokenSchema.method(methods_1.modelMethods);
tokenSchema.static(methods_1.staticMethods);
const Token = (0, mongoose_1.model)('Token', tokenSchema);
exports.default = Token;
//# sourceMappingURL=index.js.map
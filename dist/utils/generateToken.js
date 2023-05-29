"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id = 'id', expiresIn = '30d') => {
    return jsonwebtoken_1.default.sign({ id }, config_1.jwtSecret, {
        expiresIn,
    });
};
exports.default = generateToken;
//# sourceMappingURL=generateToken.js.map
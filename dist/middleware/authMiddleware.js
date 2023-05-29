"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models/");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const config_1 = require("../config");
const protect = (0, express_async_handler_1.default)(async (req, res, next) => {
    let token;
    const secret = config_1.jwtSecret;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            const _user = (await models_1.User.findById(decoded.id).select('-password'));
            req.user = _user;
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});
exports.protect = protect;
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};
exports.admin = admin;
//# sourceMappingURL=authMiddleware.js.map
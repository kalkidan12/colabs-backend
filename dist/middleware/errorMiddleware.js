"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseValidationError = exports.errorHandler = exports.notFound = void 0;
const config_1 = require("../config");
const express_validator_1 = require("express-validator");
const http_status_1 = __importDefault(require("http-status"));
const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, _req, res, _next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: config_1.nodeEnv === 'production' ? null : err.stack,
    });
};
exports.errorHandler = errorHandler;
const parseValidationError = (req, res, next) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (validationErrors.isEmpty()) {
        return next();
    }
    res.status(http_status_1.default.UNPROCESSABLE_ENTITY).send({
        errors: validationErrors.array(),
    });
};
exports.parseValidationError = parseValidationError;
//# sourceMappingURL=errorMiddleware.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.frontendURL = exports.githubCallbackUrl = exports.githubClientSecret = exports.githubClientId = exports.backendURL = exports.appEmailPass = exports.appEmail = exports.googleCallbackUrl = exports.googleClientSecret = exports.googleClientId = exports.mongoUrl = exports.nodeEnv = exports.jwtSecret = exports.port = void 0;
const joi_1 = __importDefault(require("joi"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const envSchema = joi_1.default.object({
    MONGO_URL_DEV: joi_1.default.string().required().description('MongoDb connection URL'),
    MONGO_URL_PROD: joi_1.default.string().required().description('MongoDb connection URL'),
    PORT: joi_1.default.string().required().description('PORT'),
    JWT_SECRET_KEY: joi_1.default.string().required().description('JWT secrete'),
    NODE_ENV: joi_1.default.string().allow('development', 'test', 'production').default('development'),
    GOOGLE_CLIENT_ID: joi_1.default.string().required().description('Google client id'),
    GOOGLE_CLIENT_SECRET: joi_1.default.string().required().description('Google client secret'),
    GOOGLE_CALLBACK_URL: joi_1.default.string().required().description('Google callback url'),
    APP_EMAIL: joi_1.default.string().required().description('app email is required'),
    APP_EMAIL_PASS: joi_1.default.string().required().description('app email password is required'),
    APP_URL_DEV: joi_1.default.string().required().description('app url dev is required'),
    APP_URL_PROD: joi_1.default.string().required().description('app url prod is required'),
    GITHUB_CLIENT_ID: joi_1.default.string().required().description('Github client id'),
    GITHUB_CLIENT_SECRET: joi_1.default.string().required().description('Github client secret'),
    GITHUB_CALLBACK_URL: joi_1.default.string().required().description('Github callback url'),
    FRONTEND_URL_DEV: joi_1.default.string().required().description('Frontend url dev is required'),
    FRONTEND_URL_PROD: joi_1.default.string().required().description('Frontend url prod is required'),
})
    .unknown()
    .required();
const { error, value } = envSchema.validate(process.env);
if (error)
    throw new Error(`env variables error ${error.message}`);
exports.port = value.PORT;
exports.jwtSecret = value.JWT_SECRET_KEY;
exports.nodeEnv = value.NODE_ENV;
exports.mongoUrl = exports.nodeEnv === 'development' ? value.MONGO_URL_DEV : value.MONGO_URL_PROD;
exports.googleClientId = value.GOOGLE_CLIENT_ID;
exports.googleClientSecret = value.GOOGLE_CLIENT_SECRET;
exports.googleCallbackUrl = value.GOOGLE_CALLBACK_URL;
exports.appEmail = value.APP_EMAIL;
exports.appEmailPass = value.APP_EMAIL_PASS;
exports.backendURL = exports.nodeEnv === 'development' ? value.APP_URL_DEV : value.APP_URL_PROD;
exports.githubClientId = value.GITHUB_CLIENT_ID;
exports.githubClientSecret = value.GITHUB_CLIENT_SECRET;
exports.githubCallbackUrl = value.GITHUB_CALLBACK_URL;
exports.frontendURL = exports.nodeEnv === 'development' ? value.FRONTEND_URL_DEV : value.FRONTEND_URL_PROD;
//# sourceMappingURL=envVars.js.map
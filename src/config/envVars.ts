import Joi from 'joi';
import * as dotenv from 'dotenv';
dotenv.config();

const envSchema = Joi.object({
  MONGO_URL_DEV: Joi.string().required().description('MongoDb connection URL'),
  MONGO_URL_PROD: Joi.string().required().description('MongoDb connection URL'),
  PORT: Joi.string().required().description('PORT'),
  JWT_SECRET_KEY: Joi.string().required().description('JWT secrete'),
  NODE_ENV: Joi.string().allow('development', 'test', 'production').default('development'),
  GOOGLE_CLIENT_ID: Joi.string().required().description('Google client id'),
  GOOGLE_CLIENT_SECRET: Joi.string().required().description('Google client secret'),
  GOOGLE_CALLBACK_URL: Joi.string().required().description('Google callback url'),
  APP_EMAIL: Joi.string().required().description('app email is required'),
  APP_EMAIL_PASS: Joi.string().required().description('app email password is required'),
  APP_URL_DEV: Joi.string().required().description('app url dev is required'),
  APP_URL_PROD: Joi.string().required().description('app url prod is required'),
  GITHUB_CLIENT_ID: Joi.string().required().description('Github client id'),
  GITHUB_CLIENT_SECRET: Joi.string().required().description('Github client secret'),
  GITHUB_CALLBACK_URL: Joi.string().required().description('Github callback url'),
  FRONTEND_URL_DEV: Joi.string().required().description('Frontend url dev is required'),
  FRONTEND_URL_PROD: Joi.string().required().description('Frontend url prod is required'),
})
  .unknown()
  .required();

const { error, value } = envSchema.validate(process.env);

if (error) throw new Error(`env variables error ${error.message}`);

export const port = value.PORT;
export const jwtSecret = value.JWT_SECRET_KEY;
export const nodeEnv = value.NODE_ENV;
export const mongoUrl = nodeEnv === 'development' ? value.MONGO_URL_DEV : value.MONGO_URL_PROD;
export const googleClientId = value.GOOGLE_CLIENT_ID;
export const googleClientSecret = value.GOOGLE_CLIENT_SECRET;
export const googleCallbackUrl = value.GOOGLE_CALLBACK_URL;
export const appEmail = value.APP_EMAIL;
export const appEmailPass = value.APP_EMAIL_PASS;
export const backendURL = nodeEnv === 'development' ? value.APP_URL_DEV : value.APP_URL_PROD;
export const githubClientId = value.GITHUB_CLIENT_ID;
export const githubClientSecret = value.GITHUB_CLIENT_SECRET;
export const githubCallbackUrl = value.GITHUB_CALLBACK_URL;
export const frontendURL = nodeEnv === 'development' ? value.FRONTEND_URL_DEV : value.FRONTEND_URL_PROD;

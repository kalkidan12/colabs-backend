import { nodeEnv } from '../config';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: nodeEnv === 'production' ? null : err.stack,
  });
};

const parseValidationError = (req: Request, res: Response, next: NextFunction) => {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    return next();
  }

  res.status(httpStatus.UNPROCESSABLE_ENTITY).send({
    errors: validationErrors.array(),
  });
};

export { notFound, errorHandler, parseValidationError };

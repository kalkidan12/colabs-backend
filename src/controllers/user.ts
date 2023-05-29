import { NextFunction, Request, Response } from '../types/express';
import asyncHandler from 'express-async-handler';
import { Employer, Freelancer, User, Request as RequestModel } from '../models/';
import generateToken from '../utils/generateToken';
import passport from 'passport';
import { appEmail, backendURL, frontendURL, jwtSecret, transport } from '../config';
import { forgotPasswordFormat, verifyEmailFormat } from '../utils/mailFormats';
import Token from '../models/Token';
import jwt, { Secret } from 'jsonwebtoken';
import httpStatus from 'http-status';
import { Decoded, TokenTypes } from '../types';
import { UserDiscriminators, findTypeofUser } from '../utils/finder';
import { RequestDocs, RequestStatus, RequestType } from '../types/request';
/**
 * Authenticate user and get token
 * @route POST /api/users/login
 * @access Public
 */
const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const { type } = req.query as { type: UserDiscriminators };
  const TargetUser = findTypeofUser(type);
  const user = await TargetUser.authUser(password, email);

  res.send(user);
});

/**
 * Register a new user
 * @route POST /api/users
 * @access Public
 */
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  const { type } = req.query as { type: UserDiscriminators };
  const TargetUser = findTypeofUser(type);
  const userExists = await TargetUser.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }
  const user = new TargetUser({
    firstName,
    lastName,
    email,
    password,
  });

  if (user) {
    const emailToken = await Token.create({
      token: generateToken(`${user._id}-${user.email}`, '1d'),
      expires: '1d',
      user: user._id,
      type: TokenTypes.EMAIL_VERIFY,
    });
    const link = `${backendURL}/api/v1/users/signup/verify-email/?type=${type}&token=${emailToken.token}`;
    await transport.sendMail({
      from: appEmail as string,
      to: user.email,
      html: verifyEmailFormat(link),
      subject: 'Verify your email',
    });
    await user.save();
    res.send({
      message: 'We have sent you verification email. Please verify your email',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const type = req.user?.type as UserDiscriminators;
  const TargetUser = findTypeofUser(type);
  const user = await TargetUser.findById(req.user?._id);

  if (user) {
    res.json({
      Data: user.cleanUser(),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
const updateUserSelf = asyncHandler(async (req: Request, res: Response) => {
  const TargetUser = findTypeofUser(req.user?.type as UserDiscriminators);
  const user = await TargetUser.findById(req.user?._id);
  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    await user.save();
    res.send({
      message: 'User updated successfully',
      user,
    });
  } else {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('User not found');
  }
});

/**
 * Get all users
 * @route GET /api/users
 * @access Private/Admin
 */
const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const freelancers = await Freelancer.find({});
  const employers = await Employer.find({});

  // TODO: Add pagination and caching
  res.json({
    users: [...freelancers, ...employers],
  });
});

/**
 * Delete a user
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id, type } = req.params as { id: string; type: UserDiscriminators };
  const TargetUser = findTypeofUser(type);
  const user = await TargetUser.findById(id);
  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * Get a user by ID
 * @route GET /api/users/:id
 * @access Private/Admin
 */
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id, type } = req.params as { id: string; type: UserDiscriminators };
  const TargetUser = findTypeofUser(type);
  const user = await TargetUser.findById(id);

  if (user) {
    res.json({ user: user.cleanUser() });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * Update user
 * @route PUT /api/users/:id
 * @access Private/Admin
 */
const updateUserOther = asyncHandler(async (req: Request, res: Response) => {
  const { id, type } = req.params as { id: string; type: UserDiscriminators };
  const TargetUser = findTypeofUser(type);
  const user = await TargetUser.findById(id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    await user.save();
    res.send({
      message: 'User updated successfully',
      user: user.cleanUser(),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * Authenticate user with Google
 * @route GET /api/users/google
 * @access Public
 */
const authWithGoogle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate('google', {
    state: JSON.stringify(req.query),
  })(req, res, next);
});

/**
 * Authenticate user with Google callback
 * @route GET /api/users/google/callback
 * @access Public
 */
const authWithGoogleCallback = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate(
    'google',
    {
      session: false,
      failureRedirect: '/login',
    },
    (err: Error, user: any) => {
      if (err) next(err);
      req.user = user;
      next();
    },
  )(req, res, next);
});

/**
 * Redirect user with access-toke
 * @route GET /api/users/google/callback
 * @access Public
 */
const authWithGoogleRedirect = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('access-token', req.user?.token); // todo change this to match frontend
  res.redirect(`${frontendURL}/signup-success/?type=${req.user?.type}&token=${req.user?.token}`);
});

/**
 * Redirect user with access-toke
 * @route GET /api/users/signup/verify-me
 * @access Public
 */
const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token, type } = req.query as { token: string; type: UserDiscriminators };
  const secret: Secret = jwtSecret;
  const decodedData = jwt.verify(token as string, secret) as unknown as Decoded;
  const tokenExist = await Token.findOne({
    user: decodedData.id.split('-')[0],
  });
  if (!tokenExist) {
    res.status(httpStatus.NOT_FOUND).send({
      message: 'Token not found',
    });
  } else {
    const TargetUser = findTypeofUser(type);
    const user = await TargetUser.findOne({
      email: decodedData.id.split('-')[1],
    });
    if (!user) {
      res.send({
        message: 'No user found with this email',
      });
    } else {
      await Token.findOneAndDelete({
        user: decodedData.id.split('-')[0],
      });
      user.emailVerified = true;
      await user.save();
      const accessToken = await Token.create({
        user: user._id,
        token: generateToken(user._id),
        type: TokenTypes.ACCESS,
        expires: '30d',
      }); // todo change this to match frontend
      res.redirect(`${frontendURL}/signup-success/?type=${type}&token=${accessToken.token}`);
    }
  }
});

/**
 * Authenticate user with Github
 * @route GET /api/users/github
 * @access Public
 */
const authWithGithub = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate('github', {
    state: JSON.stringify(req.query),
  })(req, res, next);
});

/**
 * Authenticate user with Github callback
 * @route GET /api/users/Github/callback
 * @access Public
 */
const authWithGithubCallback = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate(
    'github',
    {
      session: false,
      failureRedirect: '/login',
    },
    (err: Error, user: any) => {
      if (err) next(err);
      req.user = user;
      next();
    },
  )(req, res, next);
});

/**
 * Redirect user with access-toke
 * @route GET /api/users/Github/callback
 * @access Public
 */
const authWithGithubRedirect = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('access-token', req.user?.token); // todo change this to match frontend
  res.redirect(`${frontendURL}/signup-success/?type=${req.user?.type}&token=${req.user?.token}`);
});

/**
 * Forgot password
 * @route POST /api/users/forgot-password
 * @access Public
 */
const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const { type } = req.query as { type: UserDiscriminators };
  const TargetUser = findTypeofUser(type);
  const user = await TargetUser.findOne({ email });
  if (!user) res.status(httpStatus.NOT_FOUND).send({ message: 'User not found' });
  else {
    const token = generateToken(user._id);
    const link = `${backendURL}/reset-password/?token=${token}`;
    await transport.sendMail({
      from: appEmail,
      to: email,
      subject: 'Password Reset',
      html: forgotPasswordFormat(link),
    });
    res.send({
      message: 'Password reset link sent to your email',
    });
  }
});

// TODO: need refactoring

/**
 * Request account verification
 * @route POST /api/users/request
 * @access Public
 */
const submitRequest = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { docs, type } = req.body as { docs: RequestDocs[]; type: RequestType };

  await User.create({
    user: userId,
    docs: [...docs],
    status: RequestStatus.INREVIEW,
    type,
  });

  res.status(httpStatus.CREATED).send({
    message: 'Request created successfully',
  });
});

/**
 * Get all pending requests
 * @route POST /api/users/request
 * @access Private/Admin
 */
const getAllRequestOthers = asyncHandler(async (_req: Request, res: Response) => {
  // TODO: add pagination
  const requests = await User.find({ status: RequestStatus.INREVIEW });
  res.status(httpStatus.OK).send({ requests });
});

/**
 * Get all my requests
 * @route POST /api/users/request
 * @access Private
 */
const getAllRequestSelf = asyncHandler(async (_req: Request, res: Response) => {
  // TODO: add pagination
  const requests = await User.find({ user: _req.user?._id });
  res.status(httpStatus.OK).send({ requests });
});

/**
 * Get request by id
 * @route get /api/users/request/:id
 * @access Private/Admin
 */
const getRequestByIdOthers = asyncHandler(async (_req: Request, res: Response) => {
  const { id } = _req.params;
  const request = await User.findById(id);
  if (!request) res.status(httpStatus.NOT_FOUND).send({ message: 'Request not found' });
  res.status(httpStatus.OK).send({ request });
});

/**
 * Get request by id
 * @route get /api/users/request/:id
 * @access Private/Admin
 */
const getRequestByIdSelf = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const request = await User.findOne({ user: req.user?._id, _id: id });
  if (!request) res.status(httpStatus.NOT_FOUND).send({ message: 'Request not found' });
  res.status(httpStatus.OK).send({ request });
});

/**
 * Get request by id
 * @route get /api/users/request/:id
 * @access Private/Admin
 */
const deleteRequestByIdSelf = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existRequest = await User.findOne({ user: req.user?._id, _id: id });
  if (!existRequest) res.status(httpStatus.NOT_FOUND).send({ message: 'Request not found' });
  await User.deleteOne({ user: req.user?._id, _id: id });
  res.status(httpStatus.OK).send({ message: 'Request deleted successfully' });
});

/**
 * Update request status
 * @route PUT /api/users/request/:id
 * @access Private/Admin
 * @param {string} id - request id
 */
const updateRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { action } = req.query as { action: RequestStatus.APPROVED | RequestStatus.REJECTED };
  const request = await RequestModel.findById(id);
  if (!request) res.status(httpStatus.NOT_FOUND).send({ message: 'Request not found' });
  else {
    if (request?.status === RequestStatus.APPROVED)
      res.status(httpStatus.BAD_REQUEST).send({ message: 'Request already approved' });
    request.status = action;
    await request.save();
    res.status(httpStatus.OK).send({ message: 'Request updated successfully', request });
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserSelf,
  getUsers,
  deleteUser,
  getUserById,
  updateUserOther,
  authWithGoogle,
  authWithGoogleCallback,
  authWithGoogleRedirect,
  verifyEmail,
  authWithGithub,
  authWithGithubCallback,
  authWithGithubRedirect,
  forgotPassword,
  submitRequest,
  getAllRequestOthers,
  updateRequest,
  getRequestByIdOthers,
  getAllRequestSelf,
  getRequestByIdSelf,
  deleteRequestByIdSelf,
};

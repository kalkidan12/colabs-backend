"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequestByIdSelf = exports.getRequestByIdSelf = exports.getAllRequestSelf = exports.getRequestByIdOthers = exports.updateRequest = exports.getAllRequestOthers = exports.submitRequest = exports.forgotPassword = exports.authWithGithubRedirect = exports.authWithGithubCallback = exports.authWithGithub = exports.verifyEmail = exports.authWithGoogleRedirect = exports.authWithGoogleCallback = exports.authWithGoogle = exports.updateUserOther = exports.getUserById = exports.deleteUser = exports.getUsers = exports.updateUserSelf = exports.registerUser = exports.getUserProfile = exports.authUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const models_1 = require("../models/");
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const passport_1 = __importDefault(require("passport"));
const config_1 = require("../config");
const mailFormats_1 = require("../utils/mailFormats");
const Token_1 = __importDefault(require("../models/Token"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const types_1 = require("../types");
const finder_1 = require("../utils/finder");
const request_1 = require("../types/request");
const authUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const { type } = req.query;
    const TargetUser = (0, finder_1.findTypeofUser)(type);
    const user = await TargetUser.authUser(password, email);
    res.send(user);
});
exports.authUser = authUser;
const registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const { type } = req.query;
    const TargetUser = (0, finder_1.findTypeofUser)(type);
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
        const emailToken = await Token_1.default.create({
            token: (0, generateToken_1.default)(`${user._id}-${user.email}`, '1d'),
            expires: '1d',
            user: user._id,
            type: types_1.TokenTypes.EMAIL_VERIFY,
        });
        const link = `${config_1.backendURL}/api/v1/users/signup/verify-email/?type=${type}&token=${emailToken.token}`;
        await config_1.transport.sendMail({
            from: config_1.appEmail,
            to: user.email,
            html: (0, mailFormats_1.verifyEmailFormat)(link),
            subject: 'Verify your email',
        });
        await user.save();
        res.send({
            message: 'We have sent you verification email. Please verify your email',
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});
exports.registerUser = registerUser;
const getUserProfile = (0, express_async_handler_1.default)(async (req, res) => {
    var _a, _b;
    const type = (_a = req.user) === null || _a === void 0 ? void 0 : _a.type;
    const TargetUser = (0, finder_1.findTypeofUser)(type);
    const user = await TargetUser.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
    if (user) {
        res.json({
            Data: user.cleanUser(),
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.getUserProfile = getUserProfile;
const updateUserSelf = (0, express_async_handler_1.default)(async (req, res) => {
    var _a, _b;
    const TargetUser = (0, finder_1.findTypeofUser)((_a = req.user) === null || _a === void 0 ? void 0 : _a.type);
    const user = await TargetUser.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
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
    }
    else {
        res.status(http_status_1.default.NOT_FOUND);
        throw new Error('User not found');
    }
});
exports.updateUserSelf = updateUserSelf;
const getUsers = (0, express_async_handler_1.default)(async (_req, res) => {
    const freelancers = await models_1.Freelancer.find({});
    const employers = await models_1.Employer.find({});
    res.json({
        users: [...freelancers, ...employers],
    });
});
exports.getUsers = getUsers;
const deleteUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { id, type } = req.params;
    const TargetUser = (0, finder_1.findTypeofUser)(type);
    const user = await TargetUser.findById(id);
    if (user) {
        await user.remove();
        res.json({ message: 'User removed' });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.deleteUser = deleteUser;
const getUserById = (0, express_async_handler_1.default)(async (req, res) => {
    const { id, type } = req.params;
    const TargetUser = (0, finder_1.findTypeofUser)(type);
    const user = await TargetUser.findById(id);
    if (user) {
        res.json({ user: user.cleanUser() });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.getUserById = getUserById;
const updateUserOther = (0, express_async_handler_1.default)(async (req, res) => {
    const { id, type } = req.params;
    const TargetUser = (0, finder_1.findTypeofUser)(type);
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
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.updateUserOther = updateUserOther;
const authWithGoogle = (0, express_async_handler_1.default)(async (req, res, next) => {
    return passport_1.default.authenticate('google', {
        state: JSON.stringify(req.query),
    })(req, res, next);
});
exports.authWithGoogle = authWithGoogle;
const authWithGoogleCallback = (0, express_async_handler_1.default)(async (req, res, next) => {
    return passport_1.default.authenticate('google', {
        session: false,
        failureRedirect: '/login',
    }, (err, user) => {
        if (err)
            next(err);
        req.user = user;
        next();
    })(req, res, next);
});
exports.authWithGoogleCallback = authWithGoogleCallback;
const authWithGoogleRedirect = (0, express_async_handler_1.default)(async (req, res) => {
    var _a, _b, _c;
    res.cookie('access-token', (_a = req.user) === null || _a === void 0 ? void 0 : _a.token);
    res.redirect(`${config_1.frontendURL}/signup-success/?type=${(_b = req.user) === null || _b === void 0 ? void 0 : _b.type}&token=${(_c = req.user) === null || _c === void 0 ? void 0 : _c.token}`);
});
exports.authWithGoogleRedirect = authWithGoogleRedirect;
const verifyEmail = (0, express_async_handler_1.default)(async (req, res) => {
    const { token, type } = req.query;
    const secret = config_1.jwtSecret;
    const decodedData = jsonwebtoken_1.default.verify(token, secret);
    const tokenExist = await Token_1.default.findOne({
        user: decodedData.id.split('-')[0],
    });
    if (!tokenExist) {
        res.status(http_status_1.default.NOT_FOUND).send({
            message: 'Token not found',
        });
    }
    else {
        const TargetUser = (0, finder_1.findTypeofUser)(type);
        const user = await TargetUser.findOne({
            email: decodedData.id.split('-')[1],
        });
        if (!user) {
            res.send({
                message: 'No user found with this email',
            });
        }
        else {
            await Token_1.default.findOneAndDelete({
                user: decodedData.id.split('-')[0],
            });
            user.emailVerified = true;
            await user.save();
            const accessToken = await Token_1.default.create({
                user: user._id,
                token: (0, generateToken_1.default)(user._id),
                type: types_1.TokenTypes.ACCESS,
                expires: '30d',
            });
            res.redirect(`${config_1.frontendURL}/signup-success/?type=${type}&token=${accessToken.token}`);
        }
    }
});
exports.verifyEmail = verifyEmail;
const authWithGithub = (0, express_async_handler_1.default)(async (req, res, next) => {
    return passport_1.default.authenticate('github', {
        state: JSON.stringify(req.query),
    })(req, res, next);
});
exports.authWithGithub = authWithGithub;
const authWithGithubCallback = (0, express_async_handler_1.default)(async (req, res, next) => {
    return passport_1.default.authenticate('github', {
        session: false,
        failureRedirect: '/login',
    }, (err, user) => {
        if (err)
            next(err);
        req.user = user;
        next();
    })(req, res, next);
});
exports.authWithGithubCallback = authWithGithubCallback;
const authWithGithubRedirect = (0, express_async_handler_1.default)(async (req, res) => {
    var _a, _b, _c;
    res.cookie('access-token', (_a = req.user) === null || _a === void 0 ? void 0 : _a.token);
    res.redirect(`${config_1.frontendURL}/signup-success/?type=${(_b = req.user) === null || _b === void 0 ? void 0 : _b.type}&token=${(_c = req.user) === null || _c === void 0 ? void 0 : _c.token}`);
});
exports.authWithGithubRedirect = authWithGithubRedirect;
const forgotPassword = (0, express_async_handler_1.default)(async (req, res) => {
    const { email } = req.body;
    const { type } = req.query;
    const TargetUser = (0, finder_1.findTypeofUser)(type);
    const user = await TargetUser.findOne({ email });
    if (!user)
        res.status(http_status_1.default.NOT_FOUND).send({ message: 'User not found' });
    else {
        const token = (0, generateToken_1.default)(user._id);
        const link = `${config_1.backendURL}/reset-password/?token=${token}`;
        await config_1.transport.sendMail({
            from: config_1.appEmail,
            to: email,
            subject: 'Password Reset',
            html: (0, mailFormats_1.forgotPasswordFormat)(link),
        });
        res.send({
            message: 'Password reset link sent to your email',
        });
    }
});
exports.forgotPassword = forgotPassword;
const submitRequest = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { docs, type } = req.body;
    await models_1.User.create({
        user: userId,
        docs: [...docs],
        status: request_1.RequestStatus.INREVIEW,
        type,
    });
    res.status(http_status_1.default.CREATED).send({
        message: 'Request created successfully',
    });
});
exports.submitRequest = submitRequest;
const getAllRequestOthers = (0, express_async_handler_1.default)(async (_req, res) => {
    const requests = await models_1.User.find({ status: request_1.RequestStatus.INREVIEW });
    res.status(http_status_1.default.OK).send({ requests });
});
exports.getAllRequestOthers = getAllRequestOthers;
const getAllRequestSelf = (0, express_async_handler_1.default)(async (_req, res) => {
    var _a;
    const requests = await models_1.User.find({ user: (_a = _req.user) === null || _a === void 0 ? void 0 : _a._id });
    res.status(http_status_1.default.OK).send({ requests });
});
exports.getAllRequestSelf = getAllRequestSelf;
const getRequestByIdOthers = (0, express_async_handler_1.default)(async (_req, res) => {
    const { id } = _req.params;
    const request = await models_1.User.findById(id);
    if (!request)
        res.status(http_status_1.default.NOT_FOUND).send({ message: 'Request not found' });
    res.status(http_status_1.default.OK).send({ request });
});
exports.getRequestByIdOthers = getRequestByIdOthers;
const getRequestByIdSelf = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    const { id } = req.params;
    const request = await models_1.User.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, _id: id });
    if (!request)
        res.status(http_status_1.default.NOT_FOUND).send({ message: 'Request not found' });
    res.status(http_status_1.default.OK).send({ request });
});
exports.getRequestByIdSelf = getRequestByIdSelf;
const deleteRequestByIdSelf = (0, express_async_handler_1.default)(async (req, res) => {
    var _a, _b;
    const { id } = req.params;
    const existRequest = await models_1.User.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, _id: id });
    if (!existRequest)
        res.status(http_status_1.default.NOT_FOUND).send({ message: 'Request not found' });
    await models_1.User.deleteOne({ user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id, _id: id });
    res.status(http_status_1.default.OK).send({ message: 'Request deleted successfully' });
});
exports.deleteRequestByIdSelf = deleteRequestByIdSelf;
const updateRequest = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { action } = req.query;
    const request = await models_1.Request.findById(id);
    if (!request)
        res.status(http_status_1.default.NOT_FOUND).send({ message: 'Request not found' });
    else {
        if ((request === null || request === void 0 ? void 0 : request.status) === request_1.RequestStatus.APPROVED)
            res.status(http_status_1.default.BAD_REQUEST).send({ message: 'Request already approved' });
        request.status = action;
        await request.save();
        res.status(http_status_1.default.OK).send({ message: 'Request updated successfully', request });
    }
});
exports.updateRequest = updateRequest;
//# sourceMappingURL=user.js.map
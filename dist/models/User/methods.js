"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticMethods = exports.modelMethods = void 0;
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const modelMethods = {
    async matchPassword(enteredPassword) {
        return await bcryptjs_1.default.compare(enteredPassword, this.password);
    },
    async cleanUser() {
        const user = this.toObject();
        user.id = user._id;
        delete user._id;
        delete user.password;
        delete user.__v;
        delete user.createdAt;
        delete user.updatedAt;
        return user;
    },
};
exports.modelMethods = modelMethods;
const staticMethods = {
    async authUser(password, email) {
        const user = await this.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const cleanUser = await user.cleanUser();
            return Object.assign(Object.assign({}, cleanUser), { token: (0, generateToken_1.default)(user._id) });
        }
        else {
            throw new Error('Invalid email or password');
        }
    },
    async createWithGoogle(profile) {
        try {
            const exitUser = await this.findOne({ email: profile._json.email });
            let cleanUser;
            if (exitUser) {
                cleanUser = await exitUser.cleanUser();
            }
            else {
                const user = await this.create({
                    firstName: profile.displayName,
                    lastName: profile._json.family_name,
                    email: profile._json.email,
                    imageUrl: profile._json.picture,
                    googleId: profile._json.sub,
                    emailVerified: true,
                });
                cleanUser = await user.cleanUser();
            }
            return Object.assign(Object.assign({}, cleanUser), { token: (0, generateToken_1.default)(cleanUser.id) });
        }
        catch (err) {
            throw new Error(err);
        }
    },
    async createWithGithub(profile) {
        var _a, _b;
        try {
            const email = (_a = profile === null || profile === void 0 ? void 0 : profile.emails[0]) === null || _a === void 0 ? void 0 : _a.value;
            const exitUser = await this.findOne({ email });
            let cleanUser;
            if (exitUser) {
                cleanUser = await exitUser.cleanUser();
            }
            else {
                const user = await this.create({
                    email,
                    firstName: profile.displayName,
                    lastName: (_b = profile === null || profile === void 0 ? void 0 : profile.name) === null || _b === void 0 ? void 0 : _b.familyName,
                    emailVerified: true,
                });
                cleanUser = await user.cleanUser();
            }
            return Object.assign(Object.assign({}, cleanUser), { token: (0, generateToken_1.default)(cleanUser.id) });
        }
        catch (err) {
            throw new Error(err);
        }
    },
};
exports.staticMethods = staticMethods;
//# sourceMappingURL=methods.js.map
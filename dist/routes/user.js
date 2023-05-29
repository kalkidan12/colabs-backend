"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const userValidators_1 = __importDefault(require("../validators/userValidators"));
const user_1 = require("../controllers/user");
const authMiddleware_1 = require("../middleware/authMiddleware");
const requestValidations_1 = __importDefault(require("../validators/requestValidations"));
const router = express_1.default.Router();
router.route('/').post(userValidators_1.default.registerUser, errorMiddleware_1.parseValidationError, user_1.registerUser);
router.route('/login').post(userValidators_1.default.loginUser, errorMiddleware_1.parseValidationError, user_1.authUser);
router.route('/google').get(userValidators_1.default.socialRegisterUser, errorMiddleware_1.parseValidationError, user_1.authWithGoogle);
router.route('/google/callback').get(user_1.authWithGoogleCallback, user_1.authWithGoogleRedirect);
router.route('/github').get(userValidators_1.default.socialRegisterUser, errorMiddleware_1.parseValidationError, user_1.authWithGithub);
router.route('/github/callback').get(user_1.authWithGithubCallback, user_1.authWithGithubRedirect);
router.route('/signup/verify-email').get(user_1.verifyEmail);
router.route('/forgot-password').post(userValidators_1.default.forgotPassword, errorMiddleware_1.parseValidationError, user_1.forgotPassword);
router
    .route('/profile')
    .get(authMiddleware_1.protect, user_1.getUserProfile)
    .put(authMiddleware_1.protect, userValidators_1.default.updateUser, errorMiddleware_1.parseValidationError, user_1.updateUserSelf);
router.route('/request').post(requestValidations_1.default.submitRequest, errorMiddleware_1.parseValidationError, authMiddleware_1.protect, user_1.submitRequest);
router.route('/request/self').get(authMiddleware_1.protect, user_1.getAllRequestSelf);
router.route('/request/self/:id').get(authMiddleware_1.protect, user_1.getRequestByIdSelf).delete(authMiddleware_1.protect, user_1.deleteRequestByIdSelf);
router.route('/');
router.route('/').get(authMiddleware_1.protect, authMiddleware_1.admin, user_1.getUsers);
router.route('/request').get(authMiddleware_1.protect, authMiddleware_1.admin, user_1.getAllRequestOthers);
router
    .route('/request/:id')
    .get(authMiddleware_1.protect, authMiddleware_1.admin, user_1.getRequestByIdOthers)
    .put(requestValidations_1.default.updateRequest, errorMiddleware_1.parseValidationError, authMiddleware_1.protect, authMiddleware_1.admin, user_1.updateRequest);
router
    .route('/:id')
    .delete(authMiddleware_1.protect, authMiddleware_1.admin, user_1.deleteUser)
    .get(authMiddleware_1.protect, authMiddleware_1.admin, user_1.getUserById)
    .put(authMiddleware_1.protect, authMiddleware_1.admin, user_1.updateUserOther);
exports.default = router;
//# sourceMappingURL=user.js.map
import express from 'express';
import { parseValidationError } from '../middleware/errorMiddleware';
import userValidators from '../validators/userValidators';
import {
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  registerUser,
  updateUserOther,
  updateUserSelf,
  authWithGoogle,
  authWithGoogleCallback,
  authWithGoogleRedirect,
  verifyEmail,
  authWithGithub,
  authWithGithubRedirect,
  authWithGithubCallback,
  forgotPassword,
  submitRequest,
  updateRequest,
  getRequestByIdSelf,
  getAllRequestSelf,
  deleteRequestByIdSelf,
  getRequestByIdOthers,
  getAllRequestOthers,
} from '../controllers/user';
import { admin, protect } from '../middleware/authMiddleware';
import requestValidations from '../validators/requestValidations';
const router = express.Router();

// auth and public routes
router.route('/').post(userValidators.registerUser, parseValidationError, registerUser);
router.route('/login').post(userValidators.loginUser, parseValidationError, authUser);
router.route('/google').get(userValidators.socialRegisterUser, parseValidationError, authWithGoogle);
router.route('/google/callback').get(authWithGoogleCallback, authWithGoogleRedirect);
router.route('/github').get(userValidators.socialRegisterUser, parseValidationError, authWithGithub);
router.route('/github/callback').get(authWithGithubCallback, authWithGithubRedirect);
router.route('/signup/verify-email').get(verifyEmail);
router.route('/forgot-password').post(userValidators.forgotPassword, parseValidationError, forgotPassword);

// protected routes
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, userValidators.updateUser, parseValidationError, updateUserSelf);
router.route('/request').post(requestValidations.submitRequest, parseValidationError, protect, submitRequest);
router.route('/request/self').get(protect, getAllRequestSelf);
router.route('/request/self/:id').get(protect, getRequestByIdSelf).delete(protect, deleteRequestByIdSelf);

// Connection Routes
router.route('/');

// Admin routes
router.route('/').get(protect, admin, getUsers);
router.route('/request').get(protect, admin, getAllRequestOthers);
router
  .route('/request/:id')
  .get(protect, admin, getRequestByIdOthers)
  .put(requestValidations.updateRequest, parseValidationError, protect, admin, updateRequest);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUserOther);

export default router;

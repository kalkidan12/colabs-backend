import { body, query } from 'express-validator';

const userValidators = {
  registerUser: [
    query('type').not().isEmpty().isIn(['Freelancer', 'Employer']).withMessage('User type is incorrect or missign'),
    body('firstName').not().isEmpty().isString().trim().withMessage('firstName is required and should be string'),
    body('lastName').isString().trim().withMessage('firstName is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
  ],
  socialRegisterUser: [
    query('type').not().isEmpty().isIn(['Freelancer', 'Employer']).withMessage('User type is incorrect or missign'),
  ],
  updateUser: [
    body('fistName').optional().isString().trim().withMessage('First name should be a string'),
    body('email').optional().isEmail().withMessage('Please include a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
  ],
  loginUser: [
    query('type').not().isEmpty().isIn(['Freelancer', 'Employer']).withMessage('User type is incorrect or missign'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
  ],
  forgotPassword: [
    query('type').not().isEmpty().isIn(['Freelancer', 'Employer']).withMessage('User type is incorrect or missign'),
    body('email').isEmail().withMessage('Please include a valid email'),
  ],
};

export default userValidators;

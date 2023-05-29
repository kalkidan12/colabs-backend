"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const userValidators = {
    registerUser: [
        (0, express_validator_1.query)('type').not().isEmpty().isIn(['Freelancer', 'Employer']).withMessage('User type is incorrect or missign'),
        (0, express_validator_1.body)('firstName').not().isEmpty().isString().trim().withMessage('firstName is required and should be string'),
        (0, express_validator_1.body)('lastName').isString().trim().withMessage('firstName is required'),
        (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
        (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
    ],
    socialRegisterUser: [
        (0, express_validator_1.query)('type').not().isEmpty().isIn(['Freelancer', 'Employer']).withMessage('User type is incorrect or missign'),
    ],
    updateUser: [
        (0, express_validator_1.body)('fistName').optional().isString().trim().withMessage('First name should be a string'),
        (0, express_validator_1.body)('email').optional().isEmail().withMessage('Please include a valid email'),
        (0, express_validator_1.body)('password').optional().isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
    ],
    loginUser: [
        (0, express_validator_1.query)('type').not().isEmpty().isIn(['Freelancer', 'Employer']).withMessage('User type is incorrect or missign'),
        (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
        (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
    ],
    forgotPassword: [
        (0, express_validator_1.query)('type').not().isEmpty().isIn(['Freelancer', 'Employer']).withMessage('User type is incorrect or missign'),
        (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
    ],
};
exports.default = userValidators;
//# sourceMappingURL=userValidators.js.map
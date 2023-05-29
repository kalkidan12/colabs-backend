"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const request_1 = require("../types/request");
const requestValidations = {
    submitRequest: [
        (0, express_validator_1.body)('type')
            .isIn([request_1.RequestType.COMPLAIN, request_1.RequestType.VERIFICATION])
            .withMessage('Request type is incorrect or missign'),
        (0, express_validator_1.body)('docs').isArray().withMessage('Legal documents should be an array'),
        (0, express_validator_1.body)('docs.*.name').isString().withMessage('Legal document name should be a string'),
        (0, express_validator_1.body)('docs.*.img').isString().withMessage('Legal document img should be a string'),
    ],
    updateRequest: [
        (0, express_validator_1.param)('id').not().isEmpty().isMongoId().withMessage('Invalid request id'),
        (0, express_validator_1.query)('action').isIn([request_1.RequestStatus.APPROVED, request_1.RequestStatus.REJECTED]).withMessage('Invalid request status'),
    ],
};
exports.default = requestValidations;
//# sourceMappingURL=requestValidations.js.map
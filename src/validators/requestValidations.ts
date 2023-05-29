import { body, param, query } from 'express-validator';
import { RequestStatus, RequestType } from '../types/request';

const requestValidations = {
  submitRequest: [
    body('type')
      .isIn([RequestType.COMPLAIN, RequestType.VERIFICATION])
      .withMessage('Request type is incorrect or missign'),
    body('docs').isArray().withMessage('Legal documents should be an array'),
    body('docs.*.name').isString().withMessage('Legal document name should be a string'),
    body('docs.*.img').isString().withMessage('Legal document img should be a string'),
  ],
  // TODO: update request validation
  updateRequest: [
    param('id').not().isEmpty().isMongoId().withMessage('Invalid request id'),
    query('action').isIn([RequestStatus.APPROVED, RequestStatus.REJECTED]).withMessage('Invalid request status'),
  ],
};

export default requestValidations;

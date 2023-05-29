"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobs_1 = require("../controllers/jobs");
const router = express_1.default.Router();
router.route('/:userId').get(jobs_1.getJobs).post(jobs_1.postJob);
router.route('/:jobId/apply').post(jobs_1.applyJob);
router.route('/:jobId/addMembers').put(jobs_1.addTeamMembers);
router.route('/:jobId/ready').put(jobs_1.jobReady);
router.route('/:jobId/complete').put(jobs_1.completeJob);
router.route('/:jobId/delete').delete(jobs_1.deleteJob);
router.route('/download').get(jobs_1.downloadJobResultPackage);
exports.default = router;
//# sourceMappingURL=jobs.js.map
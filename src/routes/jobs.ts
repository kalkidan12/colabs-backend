import express from 'express';
import {
  addTeamMembers,
  applyJob,
  completeJob,
  deleteJob,
  downloadJobResultPackage,
  getJobs,
  jobReady,
  postJob,
} from '../controllers/jobs';
const router = express.Router();

router.route('/:userId').get(getJobs).post(postJob);

// Actions on a single job
router.route('/:jobId/apply').post(applyJob);
router.route('/:jobId/addMembers').put(addTeamMembers);
router.route('/:jobId/ready').put(jobReady);
router.route('/:jobId/complete').put(completeJob);
router.route('/:jobId/delete').delete(deleteJob);

router.route('/download').get(downloadJobResultPackage);

export default router;

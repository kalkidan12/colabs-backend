import { Request, Response } from '../types/express';
import asyncHandler from 'express-async-handler';
import { Job, JobApplication, Freelancer, Notification, Employer } from '../models';
import { Octokit } from 'octokit';
import { getFilesfromRepo } from '../utils/download';
import { JobStatus } from '../types';

// NOTE: When manipulating a job info, only the owner has accessPending, Completed, Active, Ready, Available
/**
 * Get Jobs
 * @route GET /api/v1/jobs/:userId
 * @access Public
 */
const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const jobs = await Job.find({ status: JobStatus.Available });
  const user = await Freelancer.findById(userId);

  if (user) {
    res.json({
      jobs,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * Post Job
 * @route GET /api/v1/jobs
 * @access Priviledged, Public
 */
const postJob = asyncHandler(async (req: Request, res: Response) => {
  const { recruiterId, title, description, requirements, earnings } = req.body as {
    recruiterId: string;
    title: string;
    description: string;
    requirements: string;
    earnings: number;
  };

  const employer = await Employer.findById(recruiterId);
  let errorMessage = 'User not found';
  if (employer) {
    errorMessage =
      'Your account does not yet have access to this feature. Complete your profile verification to proceed.';

    if (employer.isVerified) {
      errorMessage = 'Job Posting Failed';
      const job = await Job.create({
        title,
        description,
        earnings,
        requirements: requirements.split(','),
        owner: recruiterId,
      });

      if (job) {
        res.json({
          message: `The ${title} job is successfully posted.`,
        });
        return;
      }
    }
  }

  res.status(404);
  throw new Error(errorMessage);
});

/**
 * Delete Job
 * @route GET /api/v1/jobs
 * @access Private
 */
const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.query as { jobId: string };
  let errorMessage = 'Job not found';
  const job = await Job.findById(jobId);

  if (job) {
    errorMessage = 'Job is currently being worked on';

    if (job.status === JobStatus.Available || job.status === JobStatus.Pending || job.status === JobStatus.Completed) {
      res.json({
        message: `${job?.title} is successfully deleted.`,
      });
      return;
    }
  }
  res.status(404);
  throw new Error(errorMessage);
});

/**
 * Complete Job
 * @route GET /api/v1/jobs
 * @access Private
 */
const completeJob = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params as { jobId: string };
  // TODO: Only provide the job file assets to the recruiter when payment is completed
  // TODO: Add payment
  // TODO: Implement upgrade points and update user profile
  const job = await Job.findByIdAndUpdate(jobId, { status: JobStatus.Completed });
  let errorMessage = 'Job not found';

  if (job) {
    errorMessage = 'Notification Request Failed';

    const pendingNotifications = job.workers.map((worker: string) => {
      return {
        title: `${job.title} Completed`,
        message: `Congratulations!! You have completed the ${job.title} job.`,
        userId: worker,
      };
    });

    const notification = await Notification.insertMany(pendingNotifications);

    if (notification) {
      res.json({
        message: `${job?.title} completed successfully.`,
      });
      return;
    }
  } else {
    res.status(404);
    throw new Error(errorMessage);
  }
});

/**
 * Apply for Job
 * @route PUT /api/v1/jobs/:jobId/apply
 * @access Private
 */
const applyJob = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params as { jobId: string };
  const { workerId, estimatedDeadline, payRate, coverLetter, workBid } = req.body as {
    workerId: string;
    estimatedDeadline: string;
    payRate: string;
    coverLetter: string;
    workBid: string;
  };

  const worker = await Freelancer.findById(workerId);
  let errorMessage = worker ? 'User is not verified for jobs' : 'User not found';
  let statusCode = worker ? 403 : 404;

  if (worker && worker?.isVerified) {
    console.log({
      workerId,
      jobId,
      estimatedDeadline,
      payRate,
      coverLetter,
      workBid,
    });
    const jobApplication = await JobApplication.create({
      workerId,
      jobId,
      estimatedDeadline,
      payRate,
      coverLetter,
      workBid,
    });

    errorMessage = 'Failed to submit job proposal';
    statusCode = 500;

    if (jobApplication) {
      res.json({
        message: 'Your proposal has been sent and is pending for approval',
      });

      return;
    }
  }

  res.status(statusCode);
  res.json({
    message: errorMessage,
  });
});

/**
 * Add team members
 * @route GET /api/v1/jobs
 * @access Private
 */
const addTeamMembers = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params as { jobId: string };
  const { ownerName, team } = req.body as { ownerName: string; team: string };
  const teamMembers: string[] = team.split(',');
  const job = await Job.findById(jobId);
  let errorMessage = 'Job not found';

  if (job) {
    const workers = [...job.workers, ...teamMembers];
    const newMembersAdded = await Job.findByIdAndUpdate(jobId, { workers });
    errorMessage = 'Failed to add new members.';

    if (newMembersAdded) {
      errorMessage = 'Notification Request Failed';

      const pendingNotifications = workers.map((worker) => {
        return {
          title: `Joined a job team`,
          message: `${ownerName} has added you to work on their job as a team.`,
          userId: worker,
        };
      });

      const notification = await Notification.insertMany(pendingNotifications);

      if (notification) {
        res.json({
          message: `You have added new members to the job.`,
        });
        return;
      }
    }
  }

  res.status(404);
  throw new Error(errorMessage);
});

/**
 * Job Ready
 * @route GET /api/v1/jobs
 * @access Private
 */
const jobReady = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params as { jobId: string; workerId: string; recruiterId: string };
  const job = await Job.findByIdAndUpdate(jobId, { status: JobStatus.Ready });
  let errorMessage = 'Job not found';

  if (job) {
    const notification = await Notification.create({
      title: 'Files Ready',
      message: `Your workers are ready with the files on the ${job.title} job.`,
      userId: job.owner,
    });
    errorMessage = 'Notification Request Failed';

    if (notification) {
      res.json({
        message: `The job is ready to be viewed by the owner.`,
      });
    }
  } else {
    res.status(404);
    throw new Error(errorMessage);
  }
});

/**
 * Download and provide the result files the worker has been tasked to do.
 * @route GET /api/v1/jobs
 * @access Private
 */
const downloadJobResultPackage = asyncHandler(async (req: Request, res: Response) => {
  const { projectName, files } = req.body as { projectName: string; files: string };
  const client = new Octokit({
    auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  });

  const projectRootURL = `GET /repos/${process.env.GITHUB_ORGANIZATION}/${projectName}/contents`;
  const repoResponse = await client.request(projectRootURL);
  const selectedFiles: string[] = files.split(',');

  if (repoResponse) {
    const downloadUrls: any[] = [];
    repoResponse.data.forEach((value: any) => {
      if (selectedFiles.includes(value.name)) {
        downloadUrls.push({ name: value.name, download_url: value.download_url });
      }
    });

    // TODO: Test
    const { downloadFileName, data } = await getFilesfromRepo(projectName, downloadUrls);
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${downloadFileName}`);
    res.set('Content-Length', data.length);
    res.send(data);
  } else {
    res.status(404);
    throw new Error('File Package not found');
  }
});

export { getJobs, postJob, deleteJob, completeJob, applyJob, addTeamMembers, jobReady, downloadJobResultPackage };

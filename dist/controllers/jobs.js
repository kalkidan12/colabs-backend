"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadJobResultPackage = exports.jobReady = exports.addTeamMembers = exports.applyJob = exports.completeJob = exports.deleteJob = exports.postJob = exports.getJobs = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const models_1 = require("../models");
const octokit_1 = require("octokit");
const download_1 = require("../utils/download");
const types_1 = require("../types");
const getJobs = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const jobs = await models_1.Job.find({ status: types_1.JobStatus.Available });
    const user = await models_1.Freelancer.findById(userId);
    if (user) {
        res.json({
            jobs,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.getJobs = getJobs;
const postJob = (0, express_async_handler_1.default)(async (req, res) => {
    const { recruiterId, title, description, requirements, earnings } = req.body;
    const employer = await models_1.Employer.findById(recruiterId);
    let errorMessage = 'User not found';
    if (employer) {
        errorMessage =
            'Your account does not yet have access to this feature. Complete your profile verification to proceed.';
        if (employer.isVerified) {
            errorMessage = 'Job Posting Failed';
            const job = await models_1.Job.create({
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
exports.postJob = postJob;
const deleteJob = (0, express_async_handler_1.default)(async (req, res) => {
    const { jobId } = req.query;
    let errorMessage = 'Job not found';
    const job = await models_1.Job.findById(jobId);
    if (job) {
        errorMessage = 'Job is currently being worked on';
        if (job.status === types_1.JobStatus.Available || job.status === types_1.JobStatus.Pending || job.status === types_1.JobStatus.Completed) {
            res.json({
                message: `${job === null || job === void 0 ? void 0 : job.title} is successfully deleted.`,
            });
            return;
        }
    }
    res.status(404);
    throw new Error(errorMessage);
});
exports.deleteJob = deleteJob;
const completeJob = (0, express_async_handler_1.default)(async (req, res) => {
    const { jobId } = req.params;
    const job = await models_1.Job.findByIdAndUpdate(jobId, { status: types_1.JobStatus.Completed });
    let errorMessage = 'Job not found';
    if (job) {
        errorMessage = 'Notification Request Failed';
        const pendingNotifications = job.workers.map((worker) => {
            return {
                title: `${job.title} Completed`,
                message: `Congratulations!! You have completed the ${job.title} job.`,
                userId: worker,
            };
        });
        const notification = await models_1.Notification.insertMany(pendingNotifications);
        if (notification) {
            res.json({
                message: `${job === null || job === void 0 ? void 0 : job.title} completed successfully.`,
            });
            return;
        }
    }
    else {
        res.status(404);
        throw new Error(errorMessage);
    }
});
exports.completeJob = completeJob;
const applyJob = (0, express_async_handler_1.default)(async (req, res) => {
    const { jobId } = req.params;
    const { workerId, estimatedDeadline, payRate, coverLetter, workBid } = req.body;
    const worker = await models_1.Freelancer.findById(workerId);
    let errorMessage = worker ? 'User is not verified for jobs' : 'User not found';
    let statusCode = worker ? 403 : 404;
    if (worker && (worker === null || worker === void 0 ? void 0 : worker.isVerified)) {
        console.log({
            workerId,
            jobId,
            estimatedDeadline,
            payRate,
            coverLetter,
            workBid,
        });
        const jobApplication = await models_1.JobApplication.create({
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
exports.applyJob = applyJob;
const addTeamMembers = (0, express_async_handler_1.default)(async (req, res) => {
    const { jobId } = req.params;
    const { ownerName, team } = req.body;
    const teamMembers = team.split(',');
    const job = await models_1.Job.findById(jobId);
    let errorMessage = 'Job not found';
    if (job) {
        const workers = [...job.workers, ...teamMembers];
        const newMembersAdded = await models_1.Job.findByIdAndUpdate(jobId, { workers });
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
            const notification = await models_1.Notification.insertMany(pendingNotifications);
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
exports.addTeamMembers = addTeamMembers;
const jobReady = (0, express_async_handler_1.default)(async (req, res) => {
    const { jobId } = req.params;
    const job = await models_1.Job.findByIdAndUpdate(jobId, { status: types_1.JobStatus.Ready });
    let errorMessage = 'Job not found';
    if (job) {
        const notification = await models_1.Notification.create({
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
    }
    else {
        res.status(404);
        throw new Error(errorMessage);
    }
});
exports.jobReady = jobReady;
const downloadJobResultPackage = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectName, files } = req.body;
    const client = new octokit_1.Octokit({
        auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    });
    const projectRootURL = `GET /repos/${process.env.GITHUB_ORGANIZATION}/${projectName}/contents`;
    const repoResponse = await client.request(projectRootURL);
    const selectedFiles = files.split(',');
    if (repoResponse) {
        const downloadUrls = [];
        repoResponse.data.forEach((value) => {
            if (selectedFiles.includes(value.name)) {
                downloadUrls.push({ name: value.name, download_url: value.download_url });
            }
        });
        const { downloadFileName, data } = await (0, download_1.getFilesfromRepo)(projectName, downloadUrls);
        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=${downloadFileName}`);
        res.set('Content-Length', data.length);
        res.send(data);
    }
    else {
        res.status(404);
        throw new Error('File Package not found');
    }
});
exports.downloadJobResultPackage = downloadJobResultPackage;
//# sourceMappingURL=jobs.js.map
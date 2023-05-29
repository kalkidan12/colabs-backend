"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationSchema = exports.JobSchema = void 0;
const types_1 = require("../../../types");
const mongoose_1 = __importDefault(require("mongoose"));
const JobSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    earnings: {
        type: Number,
        required: true,
    },
    workers: {
        type: [String],
    },
    requirements: {
        type: [String],
    },
    status: {
        type: String,
        default: 'Available',
    },
    owner: {
        type: String,
        required: true,
    },
    paymentVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.JobSchema = JobSchema;
const JobApplicationSchema = new mongoose_1.default.Schema({
    workerId: {
        type: String,
        required: true,
    },
    jobId: {
        type: String,
        required: true,
    },
    coverLetter: {
        type: String,
        required: true,
    },
    estimatedDeadline: {
        type: String,
        required: true,
    },
    payRate: {
        type: String,
        required: true,
    },
    workBid: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: types_1.JobApplicationStatus.Pending,
    },
}, {
    timestamps: true,
});
exports.JobApplicationSchema = JobApplicationSchema;
//# sourceMappingURL=index.js.map
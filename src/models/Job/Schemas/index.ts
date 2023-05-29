import {
  IJobDocument,
  IJobModel,
  IJobApplicationDocument,
  IJobApplicationModel,
  JobApplicationStatus,
} from '../../../types';
import mongoose, { Schema } from 'mongoose';

const JobSchema: Schema<IJobDocument, IJobModel> = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true, // Automatically create createdAt timestamp
  },
);

const JobApplicationSchema: Schema<IJobApplicationDocument, IJobApplicationModel> = new mongoose.Schema(
  {
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
      default: JobApplicationStatus.Pending,
    },
  },
  {
    timestamps: true, // Automatically create createdAt timestamp
  },
);

export { JobSchema, JobApplicationSchema };

import { Model, Document } from 'mongoose';

/**
 * Represents a Job Application
 */
export interface IJobApplication {
  workerId: string;
  jobId: string;
  coverLetter: string;
  estimatedDeadline: string;
  payRate: string;
  workBid: string;
  status: JobApplicationStatus;
}

export interface ICleanJobApplication extends IJobApplication {
  id: string;
}

export interface IJobApplicationDocument extends IJobApplication, Document {}

export interface IJobApplicationModel extends Model<IJobApplicationDocument> {}

export enum JobApplicationStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

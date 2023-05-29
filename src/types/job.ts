import { Model, Document } from 'mongoose';

/**
 * Represents a Job
 */
export interface IJob {
  title: string;
  description: string;
  earnings: number;
  workers: string[];
  requirements: string[];
  status: string;
  owner: string;
  paymentVerified: boolean;
}

export interface ICleanJob extends IJob {
  id: string;
}

export interface IJobDocument extends IJob, Document {}

export interface IJobModel extends Model<IJobDocument> {}

export enum JobStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Active = 'Active',
  Ready = 'Ready',
  Available = 'Available',
}

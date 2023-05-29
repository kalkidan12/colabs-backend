import { Model, Document } from 'mongoose';

/**
 * Represents a repository
 */
export interface IRepository {
  name: string;
  tasks: Task[];
  files: object[];
  owner: string;
}

export interface ICleanRepository extends IRepository {
  id: string;
}

export interface IRepositoryDocument extends IRepository, Document {
  cleanRepository: () => Promise<ICleanRepository>;
}

export interface IRepositoryModel extends Model<IRepositoryDocument> {}

export type Task = {
  id: string;
  title: string;
  description?: string;
  assignees?: string[];
  deadline: string;
  status: TaskStatus;
};

export enum TaskStatus {
  Queued = 'Queued',
  Ongoing = 'Ongoing',
  Complete = 'Complete',
}

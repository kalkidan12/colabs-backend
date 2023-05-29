import mongoose from 'mongoose';
import { IJobDocument, IJobModel, IJobApplicationDocument, IJobApplicationModel } from '../../types';
import { JobSchema, JobApplicationSchema } from './Schemas';

const Job = mongoose.model<IJobDocument, IJobModel>('Job', JobSchema);
const JobApplication = mongoose.model<IJobApplicationDocument, IJobApplicationModel>(
  'JobApplication',
  JobApplicationSchema,
);

export { Job, JobApplication };

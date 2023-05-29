import mongoose, { Schema } from 'mongoose';
import { ISVTSolutionDocument, ISVTSolutionModel } from '../../types';
import { modelMethods, staticMethods } from './methods';

const svtSolutionSchema: Schema<ISVTSolutionDocument, ISVTSolutionModel> = new mongoose.Schema(
  {
    skillId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: -1,
    },
    status: {
      type: String,
      default: 'Pending',
    },
  },
  {
    timestamps: true, // Automatically create createdAt timestamp
  },
);

svtSolutionSchema.method(modelMethods);
svtSolutionSchema.static(staticMethods);

export default mongoose.model<ISVTSolutionDocument, ISVTSolutionModel>('SVTSolution', svtSolutionSchema);

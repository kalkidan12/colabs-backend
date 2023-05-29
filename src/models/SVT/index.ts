import mongoose, { Schema } from 'mongoose';
import { ISVTDocument, ISVTModel } from '../../types';
import { modelMethods, staticMethods } from './methods';

const svtSchema: Schema<ISVTDocument, ISVTModel> = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically create createdAt timestamp
  },
);

svtSchema.method(modelMethods);
svtSchema.static(staticMethods);

export default mongoose.model<ISVTDocument, ISVTModel>('SVT', svtSchema);

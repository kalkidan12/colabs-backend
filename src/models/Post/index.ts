import mongoose, { Schema } from 'mongoose';
import { IPostDocument, IPostModel } from 'src/types';
import { modelMethods, staticMethods } from './methods';

const postSchema: Schema<IPostDocument, IPostModel> = new mongoose.Schema(
  {
    textContent: {
      type: String,
    },
    imageContent: {
      type: String,
    },
    likes: {
      type: [String],
    },
    tags: {
      type: [String],
    },
    comments: {
      type: [Object],
    },
    donatable: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically create createdAt timestamp
  },
);

postSchema.method(modelMethods);
postSchema.static(staticMethods);

export default mongoose.model<IPostDocument, IPostModel>('Post', postSchema);

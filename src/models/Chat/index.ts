import mongoose, { Schema } from 'mongoose';
import { IChatDocument, IChatModel } from 'src/types';
import { modelMethods, staticMethods } from './methods';

const chatSchema: Schema<IChatDocument, IChatModel> = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    members: {
      type: [String],
      required: true,
    },
    totalMessages: {
      type: [Object],
    },
    inbox: {
      type: [Object],
    },
  },
  {
    timestamps: true, // Automatically create createdAt timestamp
  },
);

chatSchema.method(modelMethods);
chatSchema.static(staticMethods);

export default mongoose.model<IChatDocument, IChatModel>('Chat', chatSchema);

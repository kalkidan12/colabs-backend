import mongoose, { Schema } from 'mongoose';
import { INotificationDocument, INotificationModel } from 'src/types';
import { modelMethods, staticMethods } from './methods';

const notificationSchema: Schema<INotificationDocument, INotificationModel> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
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

notificationSchema.method(modelMethods);
notificationSchema.static(staticMethods);

export default mongoose.model<INotificationDocument, INotificationModel>('Notification', notificationSchema);

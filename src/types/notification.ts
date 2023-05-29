import { Model, Document } from 'mongoose';

/**
 * Represents a notification
 */
export interface INotification {
  title: string;
  message: string;
  userId: string;
}

export interface ICleanNotification extends INotification {
  id: string;
}

export interface INotificationDocument extends INotification, Document {}

export interface INotificationModel extends Model<INotificationDocument> {}

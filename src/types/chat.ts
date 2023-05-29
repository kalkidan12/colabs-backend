import { Model, Document } from 'mongoose';

/**
 * Represents a repository
 */
export interface IChat {
  type: string;
  members: string[];
  totalMessages: [{ sender: string; message: string; attachements: string; timestamp: string }];
  inbox: [{ sender: string; message: string; attachements: string; timestamp: string }];
}

export interface IChatDocument extends IChat, Document {}

export interface IChatModel extends Model<IChatDocument> {}

export enum ChatType {
  Private = 'Private',
  Group = 'Group',
}

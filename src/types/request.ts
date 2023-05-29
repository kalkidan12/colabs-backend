import { Document, Model, Types } from 'mongoose';

export enum RequestType {
  VERIFICATION = 'VERIFICATION',
  COMPLAIN = 'COMPLAIN',
}

export enum RequestStatus {
  INREVIEW = 'INREVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface RequestDocs {
  name: string;
  img: string;
}

export interface Request {
  user: Types.ObjectId;
  type: RequestType;
  status: string;
  docs: RequestDocs[];
}

export interface RequestDocument extends Request, Document {}
export interface RequestModel extends Model<RequestDocument> {}

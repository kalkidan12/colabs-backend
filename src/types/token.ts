import { Model, Document, Types } from 'mongoose';

export interface Decoded {
  id: string;
  iat: Date;
  exp: Date;
}

export interface IToken {
  token: string;
  user: Types.ObjectId;
  type: string;
  expires: string;
  blackListed: boolean;
}

export enum TokenTypes {
  REFRESH = 'REFRESH',
  ACCESS = 'ACCESS',
  PASS_RESET = 'PASS_RESET',
  EMAIL_VERIFY = 'EMAIL_VERIFY',
}

// Models
export interface ITokenDocument extends IToken, Document {}

// Statics
export interface ITokenModel extends Model<ITokenDocument> {}

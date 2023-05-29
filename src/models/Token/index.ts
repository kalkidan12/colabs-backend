import { Schema, SchemaTypes, model } from 'mongoose';
import { ITokenDocument, ITokenModel, TokenTypes } from '../../types';
import { modelMethods, staticMethods } from './methods';

const tokenSchema: Schema<ITokenDocument, ITokenModel> = new Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    default: TokenTypes.ACCESS,
    enum: Object.values(TokenTypes),
    required: true,
  },
  expires: {
    type: String,
    required: true,
  },
  blackListed: {
    type: Boolean,
    default: false,
  },
});

tokenSchema.method(modelMethods);
tokenSchema.static(staticMethods);

const Token = model<ITokenDocument, ITokenModel>('Token', tokenSchema);
export default Token;

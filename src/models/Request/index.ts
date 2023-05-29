import { Schema, SchemaTypes, model } from 'mongoose';
import { RequestDocument, RequestModel, RequestType, RequestStatus } from '../../types/request';
import { modelMethods, staicMethods } from './methods';

const requestSchema: Schema<RequestDocument, RequestModel> = new Schema({
  user: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: RequestType,
  },
  status: {
    type: String,
    default: RequestStatus.INREVIEW,
    enum: Object.values(RequestStatus),
  },
  docs: {
    type: [
      {
        name: String,
        img: String,
      },
    ],
  },
});

requestSchema.method(modelMethods);
requestSchema.static(staicMethods);

export default model<RequestDocument, RequestModel>('Request', requestSchema);

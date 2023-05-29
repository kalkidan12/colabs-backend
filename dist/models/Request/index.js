"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const request_1 = require("../../types/request");
const methods_1 = require("./methods");
const requestSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: request_1.RequestType,
    },
    status: {
        type: String,
        default: request_1.RequestStatus.INREVIEW,
        enum: Object.values(request_1.RequestStatus),
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
requestSchema.method(methods_1.modelMethods);
requestSchema.static(methods_1.staicMethods);
exports.default = (0, mongoose_1.model)('Request', requestSchema);
//# sourceMappingURL=index.js.map
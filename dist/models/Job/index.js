"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplication = exports.Job = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schemas_1 = require("./Schemas");
const Job = mongoose_1.default.model('Job', Schemas_1.JobSchema);
exports.Job = Job;
const JobApplication = mongoose_1.default.model('JobApplication', Schemas_1.JobApplicationSchema);
exports.JobApplication = JobApplication;
//# sourceMappingURL=index.js.map
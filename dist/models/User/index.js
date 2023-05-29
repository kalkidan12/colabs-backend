"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employer = exports.Freelancer = exports.User = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const methods_1 = require("./methods");
const Schemas_1 = require("./Schemas");
Schemas_1.UserSchema.method(methods_1.modelMethods);
Schemas_1.UserSchema.static(methods_1.staticMethods);
Schemas_1.UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
const User = mongoose_1.default.model('User', Schemas_1.UserSchema);
exports.User = User;
const Freelancer = User.discriminator('Freelancer', Schemas_1.FreelancerSchema);
exports.Freelancer = Freelancer;
const Employer = User.discriminator('Employer', Schemas_1.EmployerSchema);
exports.Employer = Employer;
//# sourceMappingURL=index.js.map
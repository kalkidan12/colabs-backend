import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { IUserDocument, IUserModel } from 'src/types';
import { modelMethods, staticMethods } from './methods';
import { UserSchema, FreelancerSchema, EmployerSchema } from './Schemas';

UserSchema.method(modelMethods);
UserSchema.static(staticMethods);

/**
 * Runs before the model saves and hecks to see if password has been
 * modified and hashes the password before saving to database
 */
UserSchema.pre('save', async function (this: IUserDocument, next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);
const Freelancer = User.discriminator('Freelancer', FreelancerSchema);
const Employer = User.discriminator('Employer', EmployerSchema);

export { User, Freelancer, Employer };

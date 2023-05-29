import { Employer, Freelancer, User } from '../models';
export type UserDiscriminators = 'Freelancer' | 'Employer';

export function findTypeofUser(type: UserDiscriminators) {
  if (type === 'Freelancer') return Freelancer;
  if (type === 'Employer') return Employer;

  return User;
}

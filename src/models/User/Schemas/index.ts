import { Schema } from 'mongoose';
import { IUserDocument, IUserModel, LegalInfo } from '../../../types';

export const LegalInfoSchema: Schema<LegalInfo> = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const UserSchema: Schema<IUserDocument, IUserModel> = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    occupation: {
      type: String,
    },
    location: {
      type: String,
    },
    tags: {
      type: [Object],
    },
    isRegulator: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    connections: {
      type: [String],
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
    },
    imageUrl: String,
    googleId: String,
    emailVerified: Boolean,
  },
  { timestamps: true, discriminatorKey: 'type' },
);

const FreelancerSchema: Schema<IUserDocument, IUserModel> = new Schema(
  {
    isVerified: {
      type: Boolean,
      default: false,
    },
    jobs: {
      type: [String],
    },
    reviews: {
      type: [String],
    },
    skills: {
      type: [String],
    },
    hourlyRate: {
      type: Number,
      defualt: 10,
    },
    permissions: {
      type: Object,
      default: {
        adminAccess: {
          projects: [],
        },
        uploadFiles: {
          projects: [],
        },
        deleteFiles: {
          projects: [],
        },
        deleteProject: {
          projects: [],
        },
      },
    },
  },
  { timestamps: true },
);

const EmployerSchema: Schema<IUserDocument, IUserModel> = new Schema(
  {
    legalInfo: {
      type: [LegalInfoSchema],
    },
    companyName: {
      type: String,
    },
    isVerified: {
      type: Boolean,
    },
    jobs: {
      type: [String],
    },
    reviews: {
      type: [String],
    },
  },
  { timestamps: true },
);

export { FreelancerSchema, EmployerSchema, UserSchema };

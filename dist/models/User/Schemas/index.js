"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.EmployerSchema = exports.FreelancerSchema = exports.LegalInfoSchema = void 0;
const mongoose_1 = require("mongoose");
exports.LegalInfoSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});
const UserSchema = new mongoose_1.Schema({
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
}, { timestamps: true, discriminatorKey: 'type' });
exports.UserSchema = UserSchema;
const FreelancerSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.FreelancerSchema = FreelancerSchema;
const EmployerSchema = new mongoose_1.Schema({
    legalInfo: {
        type: [exports.LegalInfoSchema],
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
}, { timestamps: true });
exports.EmployerSchema = EmployerSchema;
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkValidator = exports.contentValidator = exports.tagValidator = exports.userLoginValidator = exports.userRegValidator = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
exports.userRegValidator = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username must be at least 3 characters").max(10, "Username cannot be more than 10 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numebrs, and underscores"),
    password: zod_1.z.string().min(8, "Password min length is 8 characters").max(20, "Password max length is 20 characters")
        .refine((password) => /[a-z]/.test(password), "Must have lowercase letter")
        .refine((password) => /[A-Z]/.test(password), "Must have uppercase letter")
        .refine((password) => /\d/.test(password), "Must have number")
        .refine((password) => /[@$!%*?&]/.test(password), "Must have special character")
});
exports.userLoginValidator = zod_1.z.object({
    username: zod_1.z.string().min(3, "At least 3 characters are required").max(10, "Cannot be more than 10 characters"),
    password: zod_1.z.string().min(8, "Minimum 8 characters are required")
});
exports.tagValidator = zod_1.z.object({
    // we need to tell zod that valid array of tags from contentSchema only should be accepted
    tags: zod_1.z.array(zod_1.z.string().refine((val) => mongoose_1.default.isValidObjectId(val), { message: "Invalid Objects" })).optional()
});
exports.contentValidator = zod_1.z.object({
    link: zod_1.z.url("Must be a valid URL"),
    type: zod_1.z.enum(['image', 'video', 'article', 'audio'], { message: "Type must be image, video, article, or audio" }),
    title: zod_1.z.string().min(1, "Minimum 1 character is required").max(100, "Cannot exceed 100 characters limit"),
    tags: zod_1.z.array(zod_1.z.string().refine((val) => mongoose_1.default.isValidObjectId(val), { message: "Invalid ObjectId" })).optional(),
});
exports.linkValidator = zod_1.z.object({
    hash: zod_1.z.string().min(1, "Min 1 character is reqd for hash"),
});
//# sourceMappingURL=zodValidation.js.map
import mongoose from "mongoose";
import {z} from "zod";

export const userRegValidator = z.object({
    username:z.string().min(3,"Username must be at least 3 characters").max(10,"Username cannot be more than 10 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username can only contain letters, numebrs, and underscores"),
    password:z.string().min(8,"Password min length is 8 characters").max(20,"Password max length is 20 characters")
    .refine((password) => /[a-z]/.test(password), "Must have lowercase letter")
.refine((password) => /[A-Z]/.test(password), "Must have uppercase letter")
.refine((password) => /\d/.test(password), "Must have number")
.refine((password) => /[@$!%*?&]/.test(password), "Must have special character")
});


export const userLoginValidator = z.object({
    username:z.string().min(3,"At least 3 characters are required").max(10,"Cannot be more than 10 characters"),
    password:z.string().min(8,"Minimum 8 characters are required")
});


export const tagValidator = z.object({
    // we need to tell zod that valid array of tags from contentSchema only should be accepted
    tags: z.array(z.string().refine((val)=>mongoose.isValidObjectId(val),
    {message:"Invalid Objects"})).optional()
});

export const contentValidator = z.object({
    link: z.string().url("Must be a valid URL"),
    type: z.enum(['image', 'video', 'article', 'audio'], { message: "Type must be image, video, article, or audio" }),
    title: z.string().min(1, "Minimum 1 character is required").max(100, "Cannot exceed 100 characters limit"),
    tags: z.array(z.string().refine((val) => mongoose.isValidObjectId(val), { message: "Invalid ObjectId" })).optional(),
});

export const linkValidator = z.object({
    hash:z.string().min(1,"Min 1 character is reqd for hash"),

})
import { z } from "zod";
export declare const userRegValidator: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const userLoginValidator: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const tagValidator: z.ZodObject<{
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const contentValidator: z.ZodObject<{
    link: z.ZodURL;
    type: z.ZodEnum<{
        image: "image";
        video: "video";
        article: "article";
        audio: "audio";
    }>;
    title: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const linkValidator: z.ZodObject<{
    hash: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=zodValidation.d.ts.map
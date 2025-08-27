import { NextFunction, Request, Response } from "express";
declare module 'express' {
    interface Request {
        userId?: string;
    }
}
export declare const userMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=userMiddleware.d.ts.map
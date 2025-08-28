import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

declare module 'express' {
    interface Request {
        userId?: string; // Add userId as an optional property
    }
}

interface JwtPayloadWithId extends jwt.JwtPayload {
    id: string;
}


export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers["authorization"];
        
        // Check if authorization header exists
        if (!header) {
            return res.status(401).json({ message: "Authorization header is required" });
        }

        // Extract token from "Bearer <token>" format
        const token = header.startsWith("Bearer ") ? header.substring(7) : header;
        
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithId;
        
        // Check if decoded payload contains user id
        if (decoded && decoded.id) {
            req.userId = decoded.id;
            next();
        } else {
            return res.status(403).json({ message: "Invalid token payload" });
        }
        
    } catch (error) {
        // Handle JWT verification errors - incorrect token,expired token,and sewrver error
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: "Invalid token" });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token has expired" });
        } else {
            return res.status(500).json({ message: "Server error during authentication" });
        }
    }
}
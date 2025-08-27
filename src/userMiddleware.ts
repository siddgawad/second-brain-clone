import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
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

export const userMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_SECRET)
    if(decoded){
        req.userId=decoded.id;
        next()
    }else{
        res.status(403).json({message:"You are not logged in"})
    }
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}
const userMiddleware = (req, res, next) => {
    try {
        const header = req.headers["authorization"];
        // Check if authorization header exists
        if (!header) {
            return res.status(401).json({ message: "Authorization header is required" });
        }
        // Extract token from "Bearer <token>" format
        const token = header.startsWith("Bearer ") ? header.substring(7) : header;
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Check if decoded payload contains user id
        if (decoded && decoded.id) {
            req.userId = decoded.id;
            next();
        }
        else {
            return res.status(403).json({ message: "Invalid token payload" });
        }
    }
    catch (error) {
        // Handle JWT verification errors - incorrect token,expired token,and sewrver error
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(403).json({ message: "Invalid token" });
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: "Token has expired" });
        }
        else {
            return res.status(500).json({ message: "Server error during authentication" });
        }
    }
};
exports.userMiddleware = userMiddleware;
//# sourceMappingURL=userMiddleware.js.map
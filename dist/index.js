"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const dotenv_1 = __importDefault(require("dotenv"));
const userMiddleware_1 = require("./userMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("JWT_SECRET environment variable is required");
    process.exit(1);
}
app.post("/api/v1/signup", async (req, res) => {
    //TODO ZOD valiudation,hash the password witrh bcrypt
    const username = req.body.username;
    const password = req.body.password;
    try {
        await db_1.userModel.create({
            username: username,
            password: password
        });
        res.status(200).json({
            message: "You are signed up"
        });
    }
    catch (err) {
        res.status(403).json({
            message: "User already exists"
        });
    }
});
app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const existingUser = await db_1.userModel.findOne({ username, password });
        if (existingUser) {
            const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, JWT_SECRET);
            res.status(200).json({ token });
        }
        else {
            res.status(403).json({
                message: "Incorrect credentials"
            });
        }
    }
    catch (err) {
        res.status(600).json({ message: err });
    }
});
app.post("/api/v1/content", userMiddleware_1.userMiddleware, async (req, res) => {
    const { link, type, title } = req.body;
    try {
        await db_1.contentModel.create({
            link, type, title,
            //@ts-ignore
            userId: req.userId,
            tags: []
        });
        res.json({ message: "Content created" });
    }
    catch (err) {
        res.json({ err });
    }
});
app.get("/api/v1/content", userMiddleware_1.userMiddleware, (req, res) => {
});
app.delete("/api/v1/content", (req, res) => {
});
app.post("/api/v1/brain/share", (req, res) => {
});
app.get("/api/v1/brain/:shareLink", (req, res) => {
});
app.listen(3000);
//# sourceMappingURL=index.js.map
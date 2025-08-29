import express from "express";
import jwt from "jsonwebtoken";
import { contentModel, linkModel, userModel } from "./db";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { userMiddleware } from "./userMiddleware";
import { Request, Response } from "express";
import { userRegValidator, userLoginValidator, tagValidator, contentValidator, linkValidator } from "./zodValidation";
import { z } from "zod";
import mongoose from "mongoose";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("JWT_SECRET environment variable is required");
    process.exit(1);
}

//generate unique hash 
const generateHash = async (): Promise<string> => {
    let hash = '';
    let isUnique = false;
    while (!isUnique) {
        hash = crypto.randomBytes(4).toString('hex');
        const existingLink = await linkModel.findOne({ hash });
        if (!existingLink) {
            isUnique = true;
        }
    }
    return hash;
}

app.post("/api/v1/signup", async (req: Request, res: Response) => {
    try {
        const validateData = userRegValidator.parse(req.body);
        
        const existingUser = await userModel.findOne({ username: validateData.username });
        if (existingUser) {
            return res.status(403).json({ message: "User already exists with this username, try sign in" });
        }
        
        const hashedPassword = await bcrypt.hash(validateData.password, 10);
        
        await userModel.create({
            username: validateData.username,
            password: hashedPassword
        });
        
        res.status(200).json({
            message: "You are signed up"
        });
        
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(411).json({ message: "Error in inputs", errors: err.issues });
        }
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
})

app.post("/api/v1/signin", async (req: Request, res: Response) => {
    try {
        const validateData = userLoginValidator.parse(req.body);
        
        const existingUser = await userModel.findOne({
            username: validateData.username,
        });
        
        if (existingUser) {
            const isPasswordValid = await bcrypt.compare(validateData.password, existingUser.password);
            
            if (isPasswordValid) {
                const token = jwt.sign({ id: existingUser._id.toString() }, JWT_SECRET);
                res.status(200).json({ message: "Sign in successful", token });
            } else {
                res.status(403).json({ message: "Incorrect credentials" });
            }
        } else {
            res.status(403).json({
                message: "Incorrect credentials"
            });
        }
        
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(411).json({ message: "Error in inputs", errors: err.issues });
        }
        res.status(500).json({ message: "Internal server error" });
    }
})

// CONTENT ROUTES

app.post("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    try {
        const validateData = contentValidator.parse(req.body);
        const validateTag = tagValidator.parse(req.body);
        
        const newContent = await contentModel.create({
            link: validateData.link,
            type: validateData.type,
            title: validateData.title,
            userId: req.userId, // This is already a string from JWT
            tags: validateTag.tags || []
        });
        
        res.status(200).json({ message: "Content created", contentId: newContent._id });
        
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(411).json({ message: "Error in inputs", errors: err.issues });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
})

app.get("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    const contentId = req.query.contentId as string;
    if (!contentId) {
        return res.status(400).json({ message: "Valid Content ID is required" });
    }
    
    try {
        const existingContent = await contentModel.findOne({
            _id: contentId, // Use _id, not contentId
            userId: req.userId // req.userId is already a string
        }).populate("tags");
        
        if (!existingContent) {
            return res.status(403).json({ message: "Incorrect content Id/userId" });
        }
        
        return res.status(200).json({ content: existingContent });
        
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", err });
    }
})

app.put("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    const contentId = req.query.contentId as string;
    
    if (!contentId) {
        return res.status(400).json({ message: "Valid Content ID is required" });
    }
    
    try {
        const validateData = contentValidator.parse(req.body);
        
        const updatedContent = await contentModel.findOneAndUpdate(
            {
                _id: contentId, // Use _id, not contentId
                userId: req.userId // req.userId is already a string
            },
            {
                link: validateData.link,
                type: validateData.type,
                title: validateData.title,
                tags: validateData.tags || []
            },
            { new: true }
        );
        
        if (!updatedContent) {
            return res.status(403).json({ message: "Content not found or access denied" });
        }
        
        res.status(200).json({ message: "Content updated successfully", content: updatedContent });
        
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(411).json({ message: "Error in inputs", errors: err.issues });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    const contentId = req.query.contentId as string;
    if (!contentId) {
        return res.status(400).json({ message: "Valid Content ID is required" });
    }
    
    try {
        const existingContent = await contentModel.findOneAndDelete({
            _id: contentId, // Use _id, not contentId
            userId: req.userId // req.userId is already a string
        });
        
        if (!existingContent) {
            return res.status(403).json({ message: "Content not found or access denied" });
        }
        
        // Delete associated share links using the content's _id
        await linkModel.deleteMany({ contentId: contentId });
        
        res.status(200).json({ message: "Content deleted successfully" });
        
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", err });
    }
})

// SHARE ROUTES

app.post("/api/v1/brain/share", userMiddleware, async (req: Request, res: Response) => {
    try {
        const { contentId } = req.body;
    
        if (!contentId) {
            return res.status(400).json({ message: "Content ID is required" });
        }
        
        // Verify the content exists and belongs to the user
        const content = await contentModel.findOne({
            _id: contentId, // Use _id field
            userId: req.userId // req.userId is already a string
        });
        
        if (!content) {
            return res.status(403).json({ message: "Content not found or access denied" });
        }
        
        // Check if share link already exists
        const existingLink = await linkModel.findOne({
            contentId: contentId,
            userId: req.userId
        });
        
        if (existingLink) {
            return res.status(200).json({
                message: "Share link already exists",
                shareLink: existingLink.hash,
                shareUrl: `${req.protocol}://${req.get('host')}/api/v1/brain/${existingLink.hash}`
            });
        }
        
        // Generate unique hash
        const hash = await generateHash();
        
        // Create new share link
        const newLink = await linkModel.create({
            hash: hash,
            userId: req.userId,
            contentId: contentId
        });
        
        res.status(201).json({
            message: "Share link created successfully",
            shareLink: hash,
            shareUrl: `${req.protocol}://${req.get('host')}/api/v1/brain/${hash}`
        });
        
    } catch (err) {
        console.error("Error creating share link:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

// Get shared content route (PUBLIC - No auth required)
app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response) => {
    try {
        const { shareLink } = req.params;
        
        if (!shareLink) {
            return res.status(400).json({ message: "Share link is required" });
        }
        
        // Find the link by hash and populate related data
        const link = await linkModel.findOne({ hash: shareLink })
            .populate('userId', 'username')
            .populate('contentId');
        
        if (!link || !link.contentId) {
            return res.status(404).json({ message: "Share link not found or content deleted" });
        }
        
        const user = link.userId as any;
        const content = link.contentId as any;
        
        res.status(200).json({
            message: "Shared content retrieved successfully",
            content: {
                title: content.title,
                link: content.link,
                type: content.type,
                tags: content.tags,
                createdAt: content.createdAt
            },
            sharedBy: user.username,
            shareLink: shareLink
        });
        
    } catch (err) {
        console.error("Error accessing shared content:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/api/v1/brain/share/all", userMiddleware, async (req: Request, res: Response) => {
    try {
        const shareLinks = await linkModel.find({
            userId: req.userId // req.userId is already a string
        }).populate('contentId', 'title type link');
        
        const formattedLinks = shareLinks.map(link => {
            const content = link.contentId as any;
            
            return {
                shareLink: link.hash,
                shareUrl: `${req.protocol}://${req.get('host')}/api/v1/brain/${link.hash}`,
                content: {
                    title: content.title,
                    type: content.type,
                    link: content.link
                },
                createdAt: link.createdAt
            };
        });
        
        res.status(200).json({
            message: "Share links retrieved successfully",
            shareLinks: formattedLinks,
            count: formattedLinks.length
        });
        
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(3000);
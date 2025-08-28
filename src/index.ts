
import express from "express";
import jwt from "jsonwebtoken";
import { contentModel, userModel } from "./db";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { userMiddleware } from "./userMiddleware";
import { Request,Response} from "express";
import { userRegValidator } from "./zodValidation";
import { userLoginValidator } from "./zodValidation";
import { tagValidator } from "./zodValidation";
import { contentValidator } from "./zodValidation";
import { linkValidator } from "./zodValidation";
import {z} from "zod";

dotenv.config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("JWT_SECRET environment variable is required");
    process.exit(1);
}




app.post("/api/v1/signup",async (req:Request,res:Response)=>{
    
    //first we validate the body sent by user
    const validateData = userRegValidator.parse(req.body);
    //parse throws ZodError on failure so we will use it in catch block
    try{
        const existingUser = await userModel.findOne({username:validateData.username});
        if(existingUser){
            return res.status(403).json({message:"User already exists with this username, try sign in"});
        }else{
            // we hash the password 
            const hashedPassword = await bcrypt.hash(validateData.password,10);
            
            await userModel.create({
                username:validateData.username,
                //pass hashedPass in password
                password: hashedPassword
            })
            res.status(200).json({
                message:"You are signed up"
            });
        }
      
    }catch(err){
        if (err instanceof z.ZodError){
            return res.status(411).json({ message: "Error in inputs", errors: err.errors });
        }
        res.status(500).json({
            message:"Internal Server Error"
        });
    }
    
})




app.post("/api/v1/signin", async (req:Request,res:Response)=>{
    //we will again use ZodError since parse has been used
    const validateData = userLoginValidator.parse(req.body);
    if(!validateData){
        return res.status(411).json({message:"Error in inputs"});
    }
    try{
        // first we check if suer exists
        const existingUser = await userModel.findOne({
            username:validateData.username,
        });
        //then we have to compare the hashed pass w pass user gave
        if(existingUser){
            await bcrypt.compare(validateData.password,existingUser.password);
            //convert id to string
            const token = jwt.sign({id:existingUser._id.toString()},JWT_SECRET)
            res.status(200).json({message:"token: ",token});
        }else{
            res.status(403).json({
                message:"Incorrect credentials"
            })
        }
    }catch(err){
        if(err instanceof z.ZodError){
            return res.status(411).json({message:"Error in inputs",errors: err.errors})
        }
        res.status(500).json({message:"Internal server error"});
    }
    
   
})

app.post("/api/v1/content",userMiddleware,async (req:Request,res:Response)=>{
    const validateData = contentValidator.parse(req.body);
    const validateTag = tagValidator.parse(req.body);
    if(!validateData){
        return res.status(411).json({message:"Error in inputs"});
    }
    try{
        await contentModel.create({
            link:validateData.link,
            type:validateData.type,
            title:validateData.title,
            userId:req.userId,
            tags: validateTag.tags || []
        })
        res.status(200).json({message:"Content created"});
    }catch(err){
        if(err instanceof z.ZodError){
            return res.status(411).json({ message: "Error in inputs", errors: err.errors });
        }
        res.status(500).json({message:"Internal Server Error"});
    }
   
})

app.get("/api/v1/content",userMiddleware,(req,res)=>{
    
    
})

app.delete("/api/v1/content",(req,res)=>{

})

app.post("/api/v1/brain/share",(req,res)=>{

})

app.get("/api/v1/brain/:shareLink",(req,res)=>{

})

app.listen(3000);
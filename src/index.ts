
import express from "express";
import jwt from "jsonwebtoken";
import { contentModel, userModel } from "./db";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { userMiddleware } from "./userMiddleware";

dotenv.config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("JWT_SECRET environment variable is required");
    process.exit(1);
}




app.post("/api/v1/signup",async (req,res)=>{
    //TODO ZOD valiudation,hash the password witrh bcrypt
    const username = req.body.username;
    const password = req.body.password;
    try{
        await userModel.create({
            username:username,
            password: password
        })
        res.status(200).json({
            message:"You are signed up"
        });
    }catch(err){
        res.status(403).json({
            message:"User already exists"
        });
    }
    
})

app.post("/api/v1/signin", async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        const existingUser = await userModel.findOne({username,password});
        if(existingUser){
            const token = jwt.sign({id:existingUser._id},JWT_SECRET)
            res.status(200).json({token})
        }else{
            res.status(403).json({
                message:"Incorrect credentials"
            })
        }
    }catch(err){
        res.status(600).json({message:err});
    }
    
   
})

app.post("/api/v1/content",userMiddleware,async (req,res)=>{
    const {link,type,title} = req.body;
    try{
        await contentModel.create({
            link,type,title,
           
            userId:req.userId,
            tags: []
        })
        res.json({message:"Content created"});
    }catch(err){
        res.json({err})
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
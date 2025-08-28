import mongoose, {Schema} from "mongoose";
import dotenv from "dotenv";
import { required } from "zod/mini";

dotenv.config();
//added error handling in mongo url order to ensure no runtime errors occur
const MONGO_URL = process.env.MONGO_URL;
if(!MONGO_URL){
  throw new Error("MONGO_URL environment variable is required");
}
mongoose.connect(MONGO_URL as string)
.then(()=>console.log("Connected to database"))
.catch((err)=>console.error("DB connection error:",err));


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

  const tagSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }
  });

const contentTypes = ['image', 'video', 'article', 'audio']; // Extend as needed

const contentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
 //we need to auto-generate the content id, so we neeed to define the default 
  contentId:{type:mongoose.Types.ObjectId,required:true,default:new mongoose.Types.ObjectId()},
  createdAt : {type: Date, default: Date.now},
  isActive: { type: Boolean, default: true }
});

const linkSchema = new mongoose.Schema({
    hash: { type: String, required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }

  });


export const userModel = mongoose.model("User",userSchema);
export const tagModel = mongoose.model("Tag",tagSchema);
export const contentModel = mongoose.model("Content",contentSchema);
export const linkModel = mongoose.model("Link",linkSchema);


import mongoose, {Schema} from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL as string);
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
});

const linkSchema = new mongoose.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  });


export const userModel = mongoose.model("User",userSchema);
export const tagModel = mongoose.model("Tag",tagSchema);
export const contentModel = mongoose.model("Content",contentSchema);
export const linkModel = mongoose.model("Link",linkSchema);


import mongoose from "mongoose";
import { ENV } from "./env";
import { logger } from "./logger";

export async function connectMongo() {
  await mongoose.connect(ENV.MONGO_URL);
  logger.info("Mongo connected");
}

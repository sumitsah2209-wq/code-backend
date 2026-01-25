import mongoose from "mongoose";
import { ENV_CONFIG } from "./env.config";

export const connectDB = () => {
  mongoose
    .connect(ENV_CONFIG.db_uri, {
      dbName: ENV_CONFIG.db_name,
      autoCreate: true,
    })
    .then(() => {
      console.log("database connected");
    })
    .catch((error) => {
      console.log("----------Database connection error------------");
      console.log(error);
    });
};

// api keys

// security keys / secret

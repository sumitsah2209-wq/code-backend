import mongoose from "mongoose";
import { ENV_CONFIG } from "./env.config";

export const connectDb = () => {

  mongoose
    .connect(ENV_CONFIG.db_uri, {
      dbName:ENV_CONFIG.db_name ,
      autoCreate: true,
    })
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("----------------Database connection error-----------------");
      console.log(error);
    });
};


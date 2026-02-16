import mongoose from "mongoose";
import { ROLE } from "./enum.types";

export interface IJwtPayload {
  id: mongoose.Types.ObjectId;
  role: ROLE;
  email: string;
}

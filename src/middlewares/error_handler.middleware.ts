import { NextFunction,Request,Response } from "express";
import { ENV_CONFIG } from "../config/env.config";


export const error_handler = (error: any, req: Request, res: Response, next: NextFunction) => {
  const message = error?.message || "Internal server error";
  const statusCode = error?.statusCode || 500;
  const code = error?.code || "INTERNAL_SERVER_ERR";
  const status = error?.status || "error";

  console.log("Error handler");
  console.log(error);
  res.status(statusCode).json({
    message,
    code,
    status,
    data: null,
    originalError: ENV_CONFIG.node_env === "development" ? error.stack : null,
  });
}
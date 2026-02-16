import { NextFunction, Request, Response } from "express";
import { ENV_CONFIG } from "../config/env.config";
import { ERROR_CODES } from "../types/enum.types";

class AppError extends Error {
  public readonly status: "error" | "fail";
  public readonly code: ERROR_CODES;
  public readonly statusCode: number;

  constructor(message: string, code: ERROR_CODES, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    Error.captureStackTrace(this);
  }
}




export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  const message = error?.message || "Internal sever error";
  const stausCode = error?.statusCode || 500;
  const code = error?.code || ERROR_CODES.INTERNAL_SERVER_ERR;
  const status = error?.status || "error";

  console.log("error handler");
  console.log(error);
  res.status(stausCode).json({
    message,
    code,
    status,
    data: null,
    originalError: ENV_CONFIG.node_env === 'development' ?  error.stack : null
  });
}


export default AppError;
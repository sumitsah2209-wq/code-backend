import { NextFunction, Request, Response } from "express";
import AppError from "./error_handler.middleware";
import { ERROR_CODES, ROLE } from "../types/enum.types";
import { verifyToken } from "../utils/jwt.utils";
import { ENV_CONFIG } from "../config/env.config";
import User from "../models/user.model";

export const authenticate = (roles?: ROLE[]) => {
  // middleware
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // cookies
      const cookies = req.cookies;
      // get token
      const token = cookies["access_token"];
      if (!token) {
        throw new AppError(
          "Unauthorized.Access denied",
          ERROR_CODES.AUTH_ERR,
          401,
        );
      }
      // verify token
      const decodedData = verifyToken(token);
      if (!decodedData) {
        throw new AppError("Invalid token.", ERROR_CODES.AUTH_ERR, 400);
      }
      // check expired
      if (decodedData.exp * 1000 < Date.now()) {
        // cookie
        res.clearCookie("access_token", {
          httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
          sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
          secure: ENV_CONFIG.node_env === "development" ? false : true,
          maxAge: Date.now(),
        });

        throw new AppError(
          "Token expired.Login required",
          ERROR_CODES.AUTH_ERR,
          401,
        );
      }

      // is user exists
      const user = await User.findOne({ email: decodedData.email });

      if (!user) {
        throw new AppError(
          "Unauthorized.Access denied",
          ERROR_CODES.AUTH_ERR,
          401,
        );
      }

      // check role
      if (roles && Array.isArray(roles) && !roles.includes(user.role)) {
        throw new AppError(
          "Forbidden.Access denied",
          ERROR_CODES.AUTH_ERR,
          403,
        );
      }

      req.user = {
        id: user._id,
        role: user.role,
        email: user.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

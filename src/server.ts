import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { connectDb } from "./config/db.config";
import { ENV_CONFIG } from "./config/env.config";
import AppError, { errorHandler } from "./middlewares/error_handler.middleware";
import { ERROR_CODES } from "./types/enum.types";
import cookieParser from "cookie-parser";

//! importing routes
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import userRoutes from "./routes/user.routes";
import brandRoutes from "./routes/brand.routes";
import productRoutes from "./routes/product.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import categoryRoutes from "./routes/category.routes";

const app = express();
const PORT = ENV_CONFIG.port || 8000;
//! connect to databse

connectDb();

//!using middlewares
app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); // parse red body json data => req.body
app.use("/uploads", express.static("uploads/"));

//! root route
app.get("/", (req: Request, res: Response) => {
  console.log("/ exe");
  res.status(200).json({
    message: "Server is up & running!!!",
  });
});

//! using routes
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/categories", categoryRoutes);

//! path not found error
app.use((req: Request, res: Response, next: NextFunction) => {
  const message = `can not ${req.method} on ${req.url}`;
  const error = new AppError(message, ERROR_CODES.NOT_FOUND_ERR, 404);
  next(error);
});

//! listen
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
  console.log("press ctrl+c to close the server");
});

//? error handler middleware
app.use(errorHandler);

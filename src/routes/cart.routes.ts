import { Router } from "express";
import {
  addToCart,
  clear,
  getCart,
  remove,
} from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { OnlyUsers } from "../types/enum.types";

const router = Router();
// att to cart
router.post("/", authenticate(OnlyUsers), addToCart);

// clear cart
router.post("/clear", authenticate(OnlyUsers), clear);

// remove product
router.post("/remove", authenticate(OnlyUsers), remove);

// get cart
router.get("/", authenticate(OnlyUsers), getCart);

export default router;

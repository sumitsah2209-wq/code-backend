"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../types/enum.types");
const router = (0, express_1.Router)();
// att to cart
router.post("/", (0, auth_middleware_1.authenticate)(enum_types_1.OnlyUsers), cart_controller_1.addToCart);
// clear cart
router.post("/clear", (0, auth_middleware_1.authenticate)(enum_types_1.OnlyUsers), cart_controller_1.clear);
// remove product
router.post("/remove", (0, auth_middleware_1.authenticate)(enum_types_1.OnlyUsers), cart_controller_1.remove);
// get cart
router.get("/", (0, auth_middleware_1.authenticate)(enum_types_1.OnlyUsers), cart_controller_1.getCart);
exports.default = router;

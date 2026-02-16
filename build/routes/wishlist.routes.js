"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../types/enum.types");
const router = (0, express_1.Router)();
// create / remove
router.post('/', (0, auth_middleware_1.authenticate)(enum_types_1.OnlyUsers), wishlist_controller_1.create);
// get 
router.get('/', (0, auth_middleware_1.authenticate)(enum_types_1.OnlyUsers), wishlist_controller_1.getWishlist);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const enum_types_1 = require("../types/enum.types");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const upload = (0, multer_middleware_1.uploader)();
// get all
router.get('/', product_controller_1.getAll);
// get all featured
router.get('/featured', product_controller_1.getAllFeatured);
// get all new 
router.get('/featured', product_controller_1.getAllNewArrivals);
//get by id 
router.get('/:id', product_controller_1.getById);
//create
router.post("/", upload.fields([
    {
        name: "cover_image",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    },
]), (0, auth_middleware_1.authenticate)(enum_types_1.OnlyAdmins), product_controller_1.create);
// update
router.put("/:id", upload.fields([
    {
        name: "cover_image",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    },
]), (0, auth_middleware_1.authenticate)(enum_types_1.OnlyAdmins), product_controller_1.update);
// delete
router.delete("/:id", (0, auth_middleware_1.authenticate)(enum_types_1.OnlyAdmins), product_controller_1.remove);
// get featured product
// get new arrivals
exports.default = router;

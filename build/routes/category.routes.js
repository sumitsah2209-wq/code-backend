"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const enum_types_1 = require("../types/enum.types");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const upload = (0, multer_middleware_1.uploader)();
// get all
router.get('/', category_controller_1.getAll);
router.get('/:id', category_controller_1.getById);
// create 
router.post("/", upload.single("image"), (0, auth_middleware_1.authenticate)(enum_types_1.OnlyAdmins), category_controller_1.create);
//update
router.put("/:id", upload.single("image"), (0, auth_middleware_1.authenticate)(enum_types_1.OnlyAdmins), category_controller_1.update);
// delete
router.delete("/:id", (0, auth_middleware_1.authenticate)(enum_types_1.OnlyAdmins), category_controller_1.remove);
exports.default = router;

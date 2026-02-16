import { Router } from "express";
import { create, getAll, getById, remove, update } from "../controllers/category.controller";
import { uploader } from "../middlewares/multer.middleware";
import { OnlyAdmins } from "../types/enum.types";
import { authenticate } from "../middlewares/auth.middleware";



const router = Router()

const upload = uploader()

// get all
router.get('/',getAll);
router.get('/:id',getById)

// create 
router.post("/", upload.single("image"), authenticate(OnlyAdmins), create);

//update
router.put("/:id", upload.single("image"), authenticate(OnlyAdmins), update);

// delete
router.delete("/:id", authenticate(OnlyAdmins), remove);



export default router
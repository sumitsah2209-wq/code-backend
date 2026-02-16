import express from 'express';
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/brand.controller";
import { uploader } from '../middlewares/multer.middleware';
import { authenticate } from "../middlewares/auth.middleware";
import { OnlyAdmins } from "../types/enum.types";

const router = express.Router()

const upload = uploader()

// get all
router.get("/", getAll);

// get by id
router.get('/:id',getById)

// create 
router.post("/", upload.single("logo"), authenticate(OnlyAdmins), create); // user , admin
router.put("/:id", upload.single("logo"), authenticate(OnlyAdmins), update);


//delete 
router.delete("/:id", authenticate(OnlyAdmins), remove);



export default router
import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  getAllFeatured,
  getAllNewArrivals,
  update,
  remove,
} from "../controllers/product.controller";
import { uploader } from '../middlewares/multer.middleware';
import { OnlyAdmins } from "../types/enum.types";
import { authenticate } from "../middlewares/auth.middleware";



const router = Router()
const upload = uploader()

// get all
router.get('/',getAll)

// get all featured
router.get('/featured',getAllFeatured)

// get all new 
router.get('/featured',getAllNewArrivals)

//get by id 
router.get('/:id',getById)

//create
router.post(
  "/",
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  authenticate(OnlyAdmins),
  create,
);

// update
router.put(
  "/:id",
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  authenticate(OnlyAdmins),
  update,
);
// delete

router.delete("/:id", authenticate(OnlyAdmins), remove);
// get featured product
// get new arrivals


export default router
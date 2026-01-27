//! routing for user
import express from "express";
import {
  delete_user,
  getAll,
  getById,
  update_user,
} from "../controllers/user.controller";
//! creating express router instance
const router = express.Router();
//* get all users

router.get("/", getAll);

//* get by id

router.get("/:id", getById);

//* update
router.put("/:id", update_user);

//* delete
router.delete("/:id", delete_user);
export default router;

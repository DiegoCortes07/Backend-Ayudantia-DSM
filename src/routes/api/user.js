import { Router } from "express";
import {
  getUsers,
  createUser,
  loginUser,
  getMyPreferences,
  updateMyPreferences,
} from "../../controllers/user.js";
import { requireAuth } from "../../middlewares/auth.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.post("/login", loginUser);
router.get("/me/preferences", requireAuth, getMyPreferences);
router.patch("/me/preferences", requireAuth, updateMyPreferences);

export default router;

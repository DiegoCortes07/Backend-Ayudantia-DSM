import { Router } from "express";
import { getUsers, createUser } from "../../controllers/user.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);

export default router;

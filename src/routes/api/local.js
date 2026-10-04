import { Router } from "express";
import { createLocal, getLocals } from "../../controllers/local.js";

const router = Router();

router.get("/", getLocals);
router.post("/", createLocal);

export default router;

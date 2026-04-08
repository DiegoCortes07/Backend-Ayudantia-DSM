// router principal de la aplicacion

import { Router } from "express";
import RouterRole from "./api/role.js";
import RouterUser from "./api/user.js";

const router = Router();

router.use("/role", RouterRole);
router.use("/user", RouterUser);

export default router;

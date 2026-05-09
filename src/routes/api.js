// router principal de la aplicacion

import { Router } from "express";
import RouterRole from "./api/role.js";
import RouterUser from "./api/user.js";
import RouterProduct from "./api/product.js";

const router = Router();

router.use("/role", RouterRole);
router.use("/user", RouterUser);
router.use("/products", RouterProduct);

export default router;

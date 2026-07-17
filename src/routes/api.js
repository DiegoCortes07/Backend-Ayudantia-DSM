// router principal de la aplicacion

import { Router } from "express";
import RouterLocal from "./api/local.js";
import RouterOrder from "./api/order.js";
import RouterRole from "./api/role.js";
import RouterUser from "./api/user.js";
import RouterProduct from "./api/product.js";

const router = Router();

router.use("/role", RouterRole);
router.use("/user", RouterUser);
router.use("/products", RouterProduct);
router.use("/locals", RouterLocal);
router.use("/orders", RouterOrder);

export default router;

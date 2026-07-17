import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  updateOrderStatus,
} from "../../controllers/order.js";
import { requireAuth } from "../../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, getMyOrders);
router.post("/", requireAuth, createOrder);
router.patch("/:id/status", requireAuth, updateOrderStatus);

export default router;

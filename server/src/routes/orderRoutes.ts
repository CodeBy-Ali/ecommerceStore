import { Router } from "express";
import { createOrder } from "../controllers/orderController.ts";

const router: Router = Router();

router.post("/orders", createOrder);

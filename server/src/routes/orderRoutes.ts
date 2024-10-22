import { Router } from "express";
import { createOrder } from "../controllers/orderController.ts";
import { validateCheckoutReqBody } from "../middlewares/validator.ts";
import {
  registerUserIfNotAlready,
  saveShippingAddressIfChecked,
} from "../middlewares/orderMiddleware.ts";
import { renderOrderView } from "../controllers/pagesController.ts";

const router: Router = Router();

router.post(
  "/",
  validateCheckoutReqBody,
  registerUserIfNotAlready,
  saveShippingAddressIfChecked,
  createOrder
);

router.get("/:id", renderOrderView);

export default router;

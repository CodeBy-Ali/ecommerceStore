import { Router } from "express";
import { addShippingAddress } from "../controllers/accountController.ts";
import { protectRoute } from "../middlewares/authenticate.ts";
import {
  validateAuthBody,
  validateRegisterBody,
  validateCheckoutReqBody,
  validateShippingAddressReqBody,
} from "../middlewares/validator.ts";
import { redirectToHomeIfRegistered } from "../middlewares/authenticate.ts";
import {
  registerNewUser,
  renderAuthView,
  authenticateUser,
  logoutUser,
} from "../controllers/authController.ts";
import { renderUserAccountView } from "../controllers/pagesController.ts";

const router: Router = Router();

router.get("/", protectRoute, renderUserAccountView);

router.get("/register", redirectToHomeIfRegistered, (req, res, next) =>
  renderAuthView("register", req, res, next)
);

router.get("/login", redirectToHomeIfRegistered, (req, res, next) =>
  renderAuthView("login", req, res, next)
);

router.post("/register", validateRegisterBody, registerNewUser);

router.post(
  "/login",
  validateAuthBody,
  redirectToHomeIfRegistered,
  authenticateUser
);

router.post("/logout", logoutUser);

router.post(
  "/shippingAddress",
  protectRoute,
  validateShippingAddressReqBody,
  addShippingAddress
);

export default router;

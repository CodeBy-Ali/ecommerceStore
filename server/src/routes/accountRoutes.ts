import { Router } from "express";
import { addShippingAddress } from "../controllers/accountController.ts";
import { protectRoute } from "../middlewares/authenticate.ts";
import {
  validateAuthBody,
  validateRegisterBody,
  validateCheckoutReqBody,
  validateShippingAddressReqBody,
} from "../middlewares/validator.ts";
import { redirectIfRegistered } from "../middlewares/authenticate.ts";
import {
  registerNewUser,
  renderAuthView,
  authenticateUser,
  logoutUser,
} from "../controllers/authController.ts";
import { renderUserAccountView } from "../controllers/pagesController.ts";

const router: Router = Router();


router.get("/", renderUserAccountView);

router.get("/register", (req, res, next) =>
  renderAuthView("register", req, res, next)
);

router.get("/login", (req, res, next) =>
  renderAuthView("login", req, res, next)
);

router.post("/register", validateRegisterBody, registerNewUser);

router.post("/login", validateAuthBody, redirectIfRegistered, authenticateUser);

router.post("/logout", logoutUser);

router.post(
  "/shippingAddress",
  protectRoute,
  validateShippingAddressReqBody,
  addShippingAddress
);

export default router;

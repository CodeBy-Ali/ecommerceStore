import { Router } from "express";
import { validateAuthBody,validateRegisterBody } from "../middlewares/validator.ts";
import { redirectIfAuthorized } from "../middlewares/authenticate.ts";
import {
  sendLoginPage,
  sendRegisterPage,
  registerNewUser,
  authenticateUser
} from "../controllers/authController.ts";

const router: Router = Router();

router.get("/register", sendRegisterPage);

router.get("/login", sendLoginPage);

router.post('/register',validateRegisterBody, registerNewUser);

router.post('/login', validateAuthBody, redirectIfAuthorized, authenticateUser);

// router.post('/register', validateAuthInput, registerNewUser);
export default router;

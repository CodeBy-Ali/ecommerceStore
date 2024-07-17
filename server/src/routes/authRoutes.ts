import { Router } from "express";
import { validateAuthBody,validateRegisterBody } from "../middlewares/validator";
import { redirectIfAuthorized } from "../middlewares/authenticate";
import {
  sendLoginPage,
  sendRegisterPage,
  registerNewUser,
  authenticateUser
} from "../controllers/authController";

const router: Router = Router();

router.get("/register", sendRegisterPage);

router.get("/login", sendLoginPage);

router.post('/register',validateRegisterBody, registerNewUser);

router.post('/login', validateAuthBody, redirectIfAuthorized, authenticateUser);

// router.post('/register', validateAuthInput, registerNewUser);
export default router;

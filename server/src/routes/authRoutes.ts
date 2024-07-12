import { Router } from "express";
import { validateAuthBody } from "../middlewares/validator";
import { sendLoginPage, sendRegisterPage } from "../controllers/authController";

const router: Router = Router();

router.get("/register", sendRegisterPage);

router.get("/login", sendLoginPage);

// router.post('/register', validateAuthInput, registerNewUser);
export default router;

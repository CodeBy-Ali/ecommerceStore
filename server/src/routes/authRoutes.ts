import { Router } from "express";
import { validateAuthBody, validateRegisterBody } from "../middlewares/validator.ts";
import { redirectIfRegistered } from "../middlewares/authenticate.ts";
import { renderLoginView, renderRegisterView, registerNewUser, authenticateUser } from "../controllers/authController.ts";

const router: Router = Router();

router.get("/register", renderRegisterView);

router.get("/login", renderLoginView);

router.post("/register", validateRegisterBody, registerNewUser);

router.post("/login", validateAuthBody, redirectIfRegistered, authenticateUser);

// router.post('/register', validateAuthInput, registerNewUser);
export default router;

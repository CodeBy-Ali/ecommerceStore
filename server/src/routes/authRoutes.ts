import { Router } from "express";
import { validateAuthBody, validateRegisterBody } from "../middlewares/validator.ts";
import { redirectIfRegistered } from "../middlewares/authenticate.ts";
import { registerNewUser,renderAuthView ,authenticateUser } from "../controllers/authController.ts";

const router: Router = Router();

router.get("/register",(req,res,next)=> renderAuthView('register',req,res,next));

router.get("/login", (req,res,next) => renderAuthView('login',req,res,next));

router.post("/register", validateRegisterBody, registerNewUser);

router.post("/login", validateAuthBody, redirectIfRegistered, authenticateUser);

export default router;

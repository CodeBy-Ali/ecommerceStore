import { Router } from "express";
import { addShippingAddress } from "../controllers/accountController.ts";
import { protectRoute } from "../middlewares/authenticate.ts";


const router = Router();


router.post("/shippingAddress",protectRoute,addShippingAddress)


export default router;
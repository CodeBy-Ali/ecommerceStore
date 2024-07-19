import { Router } from "express";
import { addProductToCart } from "../controllers/cartController.ts";


const router: Router = Router();

router.post('/add', addProductToCart);


export default router;
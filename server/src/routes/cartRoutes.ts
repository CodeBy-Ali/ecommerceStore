import { Router } from "express";
import { addProductToCart } from "../controllers/cartController";


const router: Router = Router();

router.post('/add', addProductToCart);


export default router;
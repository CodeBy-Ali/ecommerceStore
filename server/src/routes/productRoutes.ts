import { Router } from "express";
import { renderProductView } from "../controllers/productController.ts";
import { validateNameParam } from "../middlewares/validator.ts";
const router = Router();


router.get('/:name', validateNameParam, renderProductView);



export default router;
import { Router } from "express";
import { renderHomeView,renderCheckoutView} from '../controllers/pagesController.ts';
import { redirectForEmptyCart } from "../middlewares/cartMiddlewares.ts";


const router: Router = Router();

router.get('/', renderHomeView);

router.get('/checkout', redirectForEmptyCart, renderCheckoutView);



export default router;


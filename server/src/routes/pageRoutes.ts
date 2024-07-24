import { Router } from "express";
import { renderHomeView,} from '../controllers/pagesController.ts';



const router: Router = Router();

router.get('/', renderHomeView);




export default router;


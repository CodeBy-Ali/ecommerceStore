import { Router } from "express";
import { renderHomeView,} from '../controllers/pagesController';



const router: Router = Router();

router.get('/', renderHomeView);




export default router;


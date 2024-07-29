import { Router } from "express";
import { renderCollectionsView } from "../controllers/collectionController.ts";



const router: Router = Router();


router.get('/',renderCollectionsView);


export default router;
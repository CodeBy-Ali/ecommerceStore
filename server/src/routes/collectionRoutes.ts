import { Router } from "express";
import { renderCollectionsView } from "../controllers/collectionController";



const router: Router = Router();


router.get('/',renderCollectionsView);


export default router;
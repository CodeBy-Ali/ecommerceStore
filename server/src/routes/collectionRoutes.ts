import { RequestHandler, Router } from "express";
import { renderCollectionsView } from "../controllers/collectionController";


const router:Router = Router();

// get all collections
router.get('/',renderCollectionsView);


export default router;
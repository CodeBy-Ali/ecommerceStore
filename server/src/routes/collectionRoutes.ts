import { Router } from "express";
import {
  renderAllCollectionsView,
  renderBestSellerCollectionView,
  renderCollectionView
 } from "../controllers/collectionController.ts";



const router: Router = Router();


router.get('/',renderAllCollectionsView);

router.get('/best-sellers', renderBestSellerCollectionView);

router.get("/:collection", renderCollectionView);



export default router; 
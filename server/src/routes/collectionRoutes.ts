import { Router } from "express";
import {
  renderAllCollectionsView,
  renderBestSellerCollectionView,
  renderCollectionView
 } from "../controllers/collectionController.ts";



const router: Router = Router();


router.get('/',renderAllCollectionsView);

router.get('/best-sellers', renderBestSellerCollectionView);

router.get('/body', (req, res, next) => renderCollectionView('body', req, res, next));

router.get('/cleansers', (req, res, next) => renderCollectionView('cleansers', req, res, next));

router.get('/conditioner', (req, res, next) => renderCollectionView('conditioner', req, res, next));

export default router; 
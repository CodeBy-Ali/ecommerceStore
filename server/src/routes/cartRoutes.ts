import { Router } from "express";
import { initializeUserSession } from "../middlewares/sessionGard.ts";
import { isAuthorized, } from "../middlewares/authenticate.ts";
import { validateReqParams } from "../middlewares/validator.ts";
import {
  addItem,
  deleteItem,
  editItem,
} from "../controllers/cartController.ts";


const router: Router = Router();

router.post('/items',initializeUserSession, addItem);

router.patch('/items/:id',isAuthorized,validateReqParams,editItem)

router.delete('/items/:id',isAuthorized,deleteItem)

export default router;
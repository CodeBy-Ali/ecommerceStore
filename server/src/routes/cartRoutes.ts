import { Router } from "express";
import { initializeUserSession } from "../middlewares/sessionGard.ts";
import { isAuthorized } from "../middlewares/authenticate.ts";
import {
  addItem,
  deleteItem,
  editItem,
} from "../controllers/cartController.ts";


const router: Router = Router();

router.post('/items',initializeUserSession, addItem);

router.patch('/item/:id',isAuthorized,editItem)

router.delete('/items/:id',isAuthorized,deleteItem)

export default router;
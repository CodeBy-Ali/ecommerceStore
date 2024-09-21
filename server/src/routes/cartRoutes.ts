import { Router } from "express";
import { initializeUserSession } from "../middlewares/sessionGard.ts";
import { isAuthorized } from "../middlewares/authenticate.ts";
import { validateCartRequest } from "../middlewares/cartMiddlewares.ts";
import { addItem, deleteItem, editItem } from "../controllers/cartController.ts";

const router: Router = Router();

router.post("/items", initializeUserSession, isAuthorized, validateCartRequest, addItem);

router.patch("/items/:id", isAuthorized, validateCartRequest, editItem);

router.delete("/items/:id", isAuthorized, deleteItem);

export default router;

import {Router } from "express";
import handleApiTestRequest from "../controllers/apiTestRequestController.ts";


const router = Router();


router.get("/", handleApiTestRequest);


export default router;
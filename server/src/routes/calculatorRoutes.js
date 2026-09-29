import { Router } from "express";
import { calculate, history } from "../controllers/calculatorController.js";

const router = Router();

router.post("/calculate", calculate);
router.get("/history", history);

export default router;

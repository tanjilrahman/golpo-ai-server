import express from "express";
import { generatePlotController } from "../controllers/plotControllers.js";

const router = express.Router();

// Generate plot
router.post("/generate", generatePlotController);

export default router;

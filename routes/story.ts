import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  getStory,
  generateStoryAndImage,
  synthesizeStory,
} from "../controllers/storyControllers.js";

const router = express.Router();

// Get single story
router.get("/:id", getStory);

// Get single story
router.post("/synthesize", ClerkExpressRequireAuth({}), synthesizeStory);

// Generate story
router.post("/generate", ClerkExpressRequireAuth({}), generateStoryAndImage);

export default router;

import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  getAllStories,
  getUserStories,
} from "../controllers/storiesControllers.js";

const router = express.Router();

// Get all public stories
router.get("/all", getAllStories);

// Get all user stories
router.get("/library", ClerkExpressRequireAuth({}), getUserStories);

export default router;

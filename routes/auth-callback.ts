import express from "express";
import { checkAndCreateUser } from "../controllers/authControllers.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();

// Handle callback
router.get("/", ClerkExpressRequireAuth({}), checkAndCreateUser);

export default router;

import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  generateCharacterController,
  getAllCharactersController,
  getSingleCharacterController,
} from "../controllers/characterControllers";

const router = express.Router();

// Get single character
router.get(
  "/find/:id",
  ClerkExpressRequireAuth({}),
  getSingleCharacterController
);

// Generate character
router.post(
  "/generate",
  ClerkExpressRequireAuth({}),
  generateCharacterController
);

// Get all characters
router.get("/all", ClerkExpressRequireAuth({}), getAllCharactersController);

export default router;

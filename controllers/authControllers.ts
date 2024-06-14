import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js"; // Likely a custom module

// @desc   Check and create user
// @route  GET /api/auth-callback
// @auth   allow any
export const checkAndCreateUser = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId;
    const user = await clerkClient.users.getUser(userId);
    const dbUser = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!dbUser && user) {
      await db.user.create({
        data: {
          id: userId,
          name: user.fullName || user?.emailAddresses[0].emailAddress,
          email: user?.emailAddresses[0].emailAddress,
          imageUrl: user.imageUrl,
        },
      });
      console.log("User created.");
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    let statusCode = 500;

    console.error("Error creating user:", err.message); // Centralized logging
    res
      .status(statusCode)
      .json({ success: false, message: "Error creating user" });
  }
};

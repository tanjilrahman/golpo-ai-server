import { db } from "../db/index.js";
import { NextFunction, Request, Response } from "express";

// @desc   Get all stories
// @route  GET /api/story/all
// @auth   allow any
export const getAllStories = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const stories = await db.story.findMany({
      where: {
        isPublic: true,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ success: true, stories });
  } catch (err: any) {
    let statusCode = 500;
    console.error(err.message, err.stack);

    res
      .status(statusCode)
      .json({ success: false, message: "Error while retrieving stories" });
  }
};

// @desc   Get all stories
// @route  GET /api/story/library
// @auth   auth required
export const getUserStories = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId;

    const stories = await db.story.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ success: true, stories });
  } catch (err: any) {
    let statusCode = 500;
    console.error(err.message, err.stack);

    res
      .status(statusCode)
      .json({ success: false, message: "Error while retrieving stories" });
  }
};

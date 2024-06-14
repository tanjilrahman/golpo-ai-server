import { db } from "../db/index.js";
import generateStory from "../lib/generateStory.js";
import generateImage from "../lib/config/initializeStability.js";
import { NextFunction, Request, Response } from "express";
import { Chapter, StoryOptions, StoryType } from "../types.js";
import generateSuperStory from "../lib/generateSuperStory.js";
import textToSpeech from "../lib/config/initializeAzure.js";
import { Story } from "@prisma/client";

// @desc   Get single story
// @route  GET /api/story/:id
// @auth   allow any
export const getStory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storyId = req.params.id;
    const story = await db.story.findUnique({
      where: {
        id: storyId,
      },
      include: {
        author: true,
      },
    });

    if (story) {
      res.status(200).json({ success: true, story });
    } else {
      res.status(404).json({
        success: false,
        message: "Story not found!",
      });
    }
  } catch (err: any) {
    let statusCode = 500;
    console.error(err.message, err.stack);

    res.status(statusCode).json({
      success: false,
      message: "Error while retrieving Story.",
    });
  }
};

// @desc   DELETE a single story
// @route  DELETE /api/story
// @auth   auth required
export const deleteStory = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const storyId = req.params.id;
    const story = await db.story.delete({
      where: {
        id: storyId,
        authorId: req.auth.userId,
      },
    });

    if (story) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({
        success: false,
        message: "Story not found!",
      });
    }
  } catch (err: any) {
    let statusCode = 500;
    console.error(err.message, err.stack);

    res.status(statusCode).json({
      success: false,
      message: "Error while retrieving Story.",
    });
  }
};

// @desc   Story speech
// @route  POST /api/story/synthesize
// @auth   auth required
export const synthesizeStory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { storyId } = req.body;
    const story: any = await db.story.findUnique({
      where: {
        id: storyId,
      },
    });

    if (story && !story.audioUrl && !story.isSuperStory) {
      const chapter: Chapter = story.chapters[0];
      const storyContent = `${chapter.title}\n\n${chapter.story.join("\n\n")}`;

      // Convert story to speech
      const url = await textToSpeech(storyContent, story.language);

      // Save to db
      await db.story.update({
        where: {
          id: storyId,
        },
        data: {
          audioUrl: url,
        },
      });
      console.log("Uploaded");

      res.status(200).json({ success: true, audioUrl: url });
    } else if (story && story.audioUrl && !story.isSuperStory) {
      res.status(400).json({
        success: false,
        message: "Audio already available!",
      });
    } else if (story && story.isSuperStory) {
      console.log("Super story is not supported yet.");
      res
        .status(400)
        .json({ success: false, message: "Super story is not supported yet." });
    } else {
      res.status(404).json({
        success: false,
        message: "Story not found!",
      });
    }
  } catch (err: any) {
    let statusCode = 500;
    console.error(err.message, err.stack);

    res.status(statusCode).json({
      success: false,
      message: "Error while synthesize Story.",
    });
  }
};

// @desc   Generate story
// @route  POST /api/story/generate
// @auth   auth required
export const generateStoryAndImage = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { plot, options }: { plot: string; options: StoryOptions } = req.body;

    // Generate the story
    console.log("Generating story...");
    let storyData;
    if (options.isSuperStory) {
      storyData = await generateSuperStory(plot, options);
    } else {
      storyData = await generateStory(plot, options);
    }
    console.log("Story generation complete!", storyData);

    // Generate associated images
    const imagePrompts = storyData.imagePrompts;
    const imagePromises = imagePrompts.map(async (prompt: string, i) => {
      console.log(`Generating story image ${i + 1}`);
      return await generateImage(prompt);
    });

    const images = await Promise.all(imagePromises);

    // Save the story and images
    const story = await db.story.create({
      data: {
        images: images,
        chapters: storyData.chapters,
        isPublic: true,
        language: options.language,
        readerAge: options.readerAge,
        storyType: options.storyType,
        isSuperStory: options.isSuperStory,
        writingStyle: options.writingStyle,
        author: {
          connect: {
            id: req.auth.userId,
          },
        },
      },
    });

    console.log("Story generated!");
    res.status(201).json({ success: true, storyId: story.id });
  } catch (err: any) {
    const statusCode = 500;
    console.error(err.message, err.stack);

    res.status(statusCode).json({
      success: false,
      message: "Error while generating story. Please try again later.",
    });
  }
};

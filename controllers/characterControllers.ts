import { db } from "../db/index.js";
import generateImage from "../lib/config/initializeStability.js";
import generateCharacter from "../lib/generateCharacter.js";
import { NextFunction, Request, Response } from "express";
import { uuid } from "uuidv4";

// @desc   Get single character
// @route  GET /api/character/:id
// @auth   auth required
export const getSingleCharacterController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const characterId = req.params.id;
    const character = await db.character.findUnique({
      where: {
        id: characterId,
      },
      include: {
        author: true,
      },
    });

    if (character) {
      res.status(200).json({ success: true, character });
    } else {
      res.status(404).json({
        success: false,
        message: "Character not found!",
      });
    }
  } catch (err: any) {
    let statusCode = 500;
    console.error(err.message, err.stack);

    res.status(statusCode).json({
      success: false,
      message: "Error while retrieving Character.",
    });
  }
};

// @desc   Get all characters
// @route  GET /api/character/all
// @auth   auth required
export const getAllCharactersController = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const characters = await db.character.findMany({
      where: {
        authorId: req.auth.userId,
      },
    });

    res.status(200).json({ success: true, characters });
  } catch (err: any) {
    let statusCode = 500;
    console.error(err.message, err.stack);

    res
      .status(statusCode)
      .json({ success: false, message: "Error while retrieving characters" });
  }
};

// @desc   Generate character
// @route  POST /api/character/generate
// @auth   auth required
export const generateCharacterController = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, name, details } = req.body;

    // Generate Character
    console.log("Generating character...");
    const characterData = await generateCharacter(name, details);
    console.log(characterData);
    // Generate Image
    console.log("Generating image...");
    const characterImage = await generateImage(characterData);

    // Save to database
    const character = await db.character.upsert({
      where: {
        id: id || uuid(),
      },
      update: {
        name: name,
        details: details,
        image: characterImage,
      },
      create: {
        name: name,
        details: details,
        image: characterImage,
        author: {
          connect: {
            id: req.auth.userId,
          },
        },
      },
    });
    console.log("Character generation complete!");

    res.status(201).json({
      success: true,
      charaImageUrl: characterImage,
      characterId: character.id,
    });
  } catch (err: any) {
    let statusCode = 500;
    console.error(err.message, err.stack);

    res.status(statusCode).json({
      success: false,
      message: "Error while generating Character.",
    });
  }
};

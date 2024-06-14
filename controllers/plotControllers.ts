import generatePlot from "../lib/generatePlot.js";
import { NextFunction, Request, Response } from "express";
import { ParsedPlotDataType } from "../types.js";

// @desc   Generate plot
// @route  POST /api/plot/generate
// @auth   auth required
export const generatePlotController = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { options } = req.body;
    console.log("Generating plot...");

    const plotData = await generatePlot(options);
    const ParsedPlotData: ParsedPlotDataType[] = JSON.parse(plotData);
    console.log("Plot generation complete!");

    res.status(201).json({ success: true, plots: ParsedPlotData });
  } catch (err: any) {
    let statusCode = 500;
    console.error(err.message, err.stack);

    res.status(statusCode).json({
      success: false,
      message: "Error while generating Plot.",
    });
  }
};

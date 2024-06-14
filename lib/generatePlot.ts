import { readerAges, storyTypes, writingStyles } from "../storyOptions";
import { StoryOptions } from "../types";
import generate from "./config/initializeGemini";

async function generatePlot(options: StoryOptions) {
  const storyType = storyTypes.find((type) => type.value === options.storyType);
  const readerAge = readerAges.find((age) => age.value === options.readerAge);
  const writingStyle = writingStyles.find(
    (style) => style.value === options.writingStyle
  );

  const promptBangla = `You're a great story plot teller with a knack for creating immersive and engaging narratives. Your task now is to craft 2 Epic, Sweeping, Story plot with twisting end. Make sure it is very very short.\n- Characters: Cute, Distinct and relatable.\n- Setting: Real or fantastical\n- Genre: ${storyType?.label}. ${storyType?.description}.\n- Reader age: ${readerAge?.label}. Generate age appropriate stories.\n Writing style: ${writingStyle?.label}. ${writingStyle?.description}\n- Format: in JSON array format with keys for 'title' as string in ${options.language}, and 'plot' as strings in ${options.language}\n- Each Plot Length: 2-3 lines`;

  const response = await generate(promptBangla, "application/json");

  return response;
}

export default generatePlot;

import { readerAges, storyTypes, writingStyles } from "../storyOptions";
import { ParsedStory, StoryOptions } from "../types";
import generate from "./config/initializeGemini";

async function generateStory(plot: string, options: StoryOptions) {
  const storyType = storyTypes.find((type) => type.value === options.storyType);
  const readerAge = readerAges.find((age) => age.value === options.readerAge);
  const writingStyle = writingStyles.find(
    (style) => style.value === options.writingStyle
  );

  const prompt = `You're a great storyteller with a knack for creating immersive and engaging narratives. Your task now is to craft a Epic, Sweeping, Multi-layered story book with the following criteria:\n- Plot: ${plot}\n- Characters: Cute, Distinct and relatable, introduce each character with their appearance details\n- Setting: Real or fantastical\n- Structure: Story should have an engaging Introduction, rising action, climax, falling action, conclusion\n- Genre: ${storyType?.label}. ${storyType?.description}.\n- Reader age: ${readerAge?.label}. Generate age appropriate stories.\n Writing style: ${writingStyle?.label}. ${writingStyle?.description}\n- Image prompts: Provide three distinct scenarios for image generation, including: \n1. A scene that sets the story in motion (starting point) \n2. A pivotal moment in the story (mid-point) \n3. The conclusion of the story (ending point) \nDescription of each image prompt should include: * Characters' appearance and age * Relevant props or objects * Contextual information to help generate an image that accurately represents the scene. \nVERY IMPORTANT - if same characters' then the same appearance, same physical traits should be described at the beginning of each scenario!\n- Format: in JSON object format with keys for 'imagePrompts' as array of strings in English, and 'chapter' as object consist of a 'title' type string in ${options.language} and 'story' an array of paragraphs in ${options.language}.\n- Length: story should have 10 paragraphs. Each paragraph should have 400-600 characters.`;

  let parsedStory: ParsedStory;

  const response = await generate(prompt, "application/json");

  try {
    parsedStory = JSON.parse(response);
  } catch (jsonParseError) {
    console.error("Error while parsing JSON:", jsonParseError);
    console.log("Regenerating the story...");
    // Retry story generation
    const retryResponse = await generate(prompt, "application/json");
    parsedStory = JSON.parse(retryResponse);
  }

  return {
    imagePrompts: parsedStory.imagePrompts,
    chapters: [parsedStory.chapter],
  };
}

export default generateStory;

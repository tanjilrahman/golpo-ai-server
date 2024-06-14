import { readerAges, storyTypes, writingStyles } from "../storyOptions";
import { StoryData, ParsedSuperStory, StoryOptions, Chapter } from "../types";
import generate from "./config/initializeGemini";

function convertToText(input: string | Chapter[]) {
  if (typeof input === "string") {
    return input;
  }

  let paragraph = "";

  for (const superStory of input) {
    paragraph += `**${superStory.title}**: `;
    paragraph += superStory.story.join(" ");
    paragraph += "\n\n";
  }

  return paragraph.trim();
}

async function generateSuperStory(plot: string, options: StoryOptions) {
  const storyType = storyTypes.find((type) => type.value === options.storyType);
  const readerAge = readerAges.find((age) => age.value === options.readerAge);
  const writingStyle = writingStyles.find(
    (style) => style.value === options.writingStyle
  );

  const chaptersCount = 10;
  let chapters = [];
  let imagePrompts = [];

  const getSuperPrompt = (chapter: number, story: string | Chapter[]) => {
    const prompt = `You're a great storyteller with a knack for creating immersive and engaging narratives. Your task now is to craft a Epic, Sweeping, Multi-layered story book.\n- This is chapter - ${chapter} of ${chaptersCount}\n- Previous chapters or plot: ${convertToText(
      story
    )}.\nNow create the next chapter by following the previous chapters making sure each chapters' story line is fully connected. Follow these criterias while generating the story:\n- Characters: Cute, Distinct and relatable, introduce each character with their appearance details\n- Setting: Real or fantastical\n- Structure: Story should have an engaging Introduction, rising action, climax, falling action, conclusion\n- Genre: ${
      storyType?.label
    }. ${storyType?.description}.\n- Reader age: ${
      readerAge?.label
    }. Generate age appropriate stories.\n Writing style: ${
      writingStyle?.label
    }. ${
      writingStyle?.description
    }\n- Image prompts: Create a beautiful image prompt for image generation that represents the chapter best. \nDescription of each image prompt should include: * Characters' appearance and age * Relevant props or objects * Contextual information to help generate an image that accurately represents the scene. \nVERY IMPORTANT - if same characters' then the same appearance, same physical traits should be described at the beginning of each scenario!\n- Format: in JSON object format with keys for 'imagePrompt' as string in English, and 'chapter' as object consist of a 'title' type string in ${
      options.language
    } and 'story' an array of paragraphs in ${
      options.language
    }.\n- Length: story should have 6-8 paragraphs. Each paragraph should have 400-600 characters.`;

    return prompt;
  };

  for (let chapter = 1; chapter <= chaptersCount; chapter++) {
    const prompt = chapter === 1 ? plot : chapters;
    const response: string = await generate(
      getSuperPrompt(chapter, prompt),
      "application/json"
    );

    let parsedResponse: ParsedSuperStory;
    try {
      parsedResponse = JSON.parse(response);
    } catch (jsonParseError) {
      console.error(
        `Error while parsing JSON. Chapter: ${chapter}`,
        jsonParseError
      );
      console.log(`Regenerating chapter ${chapter}...`);
      // Retry story generation
      const retryResponse = await generate(
        getSuperPrompt(chapter, prompt),
        "application/json"
      );
      parsedResponse = JSON.parse(retryResponse);
    }
    chapters.push(parsedResponse.chapter);
    imagePrompts.push(parsedResponse.imagePrompt);
  }

  const parsedStory: StoryData = {
    imagePrompts,
    chapters,
  };

  return parsedStory;
}

export default generateSuperStory;

import generate from "./config/initializeGemini";

async function generateCharacter(name: string, details: string) {
  const imagePrompt = `You're a great image prompt engineer. Your task now is to craft an Epic, Beautiful, Cute kid, Happy, Portrait image prompt for a kid. By default the characters' Age is 4-8 years old. By default the character is a kid. But understand the character from the character details. It could be a older person as well. Full character body must be visible.\n- Character name - ${name}. \n- Character details - ${details}\n- Prompt length - Short`;

  const response = await generate(imagePrompt, "text/plain");

  return response;
}

export default generateCharacter;

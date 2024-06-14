import fetch from "node-fetch";
import cloudinary, { UploadApiResponse } from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const engineId = "stable-diffusion-xl-1024-v1-0";
const apiHost = "https://api.stability.ai";
const apiKeys = [
  process.env.STABILITY_API_KEY_1,
  process.env.STABILITY_API_KEY_2,
  process.env.STABILITY_API_KEY_3,
];

interface StabilityApiResponse {
  artifacts: [{ base64: string }];
}

const generateImage = async (prompt: string) => {
  if (!apiKeys) throw new Error("Missing Stability API key.");

  let cloudImageUrl: UploadApiResponse;
  let responseCode = 0;
  let currentApi = 0;

  while (responseCode !== 200) {
    const response = await fetch(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKeys[currentApi]}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
            },
          ],
          cfg_scale: 30,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
          style_preset: "anime",
        }),
      }
    );

    if (response.status !== 200) {
      if (response.status === 429) {
        console.log("Unauthorized (429). Trying again...");
        currentApi += 1;
        continue;
      }
      throw new Error(
        `Non-200 response: ${response.status}. ${await response.text()}`
      );
    }

    responseCode = 200;
    const responseJSON: unknown = await response.json();
    const base64 = (responseJSON as StabilityApiResponse).artifacts[0].base64;
    const newImage = `data:image/png;base64,${base64}`;

    cloudImageUrl = await cloudinary.v2.uploader.upload(newImage);
  }

  return cloudImageUrl!.secure_url;
};

export default generateImage;

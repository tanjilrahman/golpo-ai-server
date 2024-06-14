import sdk from "microsoft-cognitiveservices-speech-sdk";
import cloudinary from "cloudinary";
import { PassThrough } from "node:stream";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const subscriptionKey = process.env.AZURE_SPEECH_KEY;
const serviceRegion = "southeastasia";

function textToSpeech(text: string, language: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      subscriptionKey!,
      serviceRegion
    );
    speechConfig.speechSynthesisVoiceName =
      language === "bangla" ? "bn-BD-PradeepNeural" : "en-US-BrianNeural";
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const { audioData } = result;

          synthesizer.close();

          // convert arrayBuffer to stream
          const bufferStream = new PassThrough();
          bufferStream.end(Buffer.from(audioData));

          // Upload the audio data to Cloudinary as a raw buffer
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            {
              resource_type: "video",
            },
            (error, result) => {
              if (error) {
                console.error("Upload Error:", error);
                reject(error);
              } else {
                resolve(result?.secure_url || "");
              }
            }
          );

          // Pipe the buffer stream to the upload stream
          bufferStream.pipe(uploadStream);
        } else {
          console.error(
            "Speech synthesis canceled, " +
              result.errorDetails +
              "\nDid you set the speech resource key and region values?"
          );
          reject(new Error(result.errorDetails));
        }
      },
      (error) => {
        console.log(error);
        synthesizer.close();
        reject(error);
      }
    );
  });
}

export default textToSpeech;

import { Engine, LanguageCode, OutputFormat, PollyClient, SynthesizeSpeechCommand, TextType, VoiceId } from "@aws-sdk/client-polly";
import { writeFile } from "fs/promises";

import "dotenv/config"; 

const client = new PollyClient({ region: "ap-northeast-1" });

const synthesizeSpeech = async () => {
  try {
    const params = {
      Engine: Engine.NEURAL,
      LanguageCode: LanguageCode.ja_JP,
      VoiceId: VoiceId.Kazuha,
      OutputFormat: OutputFormat.MP3,
      TextType: TextType.TEXT,
      Text: "Hello, this is a sample text to speech conversion.",
    };

    const command = new SynthesizeSpeechCommand(params);
    const response = await client.send(command);

    if (response.AudioStream) {
      const audioBuffer = Buffer.from(await response.AudioStream.transformToByteArray());
      await writeFile("output.mp3", audioBuffer);
      console.log("Audio file saved as output.mp3");
    } else {
      console.error("No audio stream in the response.");
    }
  } catch (error) {
    console.error("Error synthesizing speech:", error);
  }
};

synthesizeSpeech();

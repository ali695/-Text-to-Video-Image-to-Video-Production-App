import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, AspectRatio } from "../types";

// Helper to check API key status (AI Studio specific)
export const checkApiKey = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    return await (window as any).aistudio.hasSelectedApiKey();
  }
  return !!process.env.API_KEY;
};

export const promptForKey = async (): Promise<void> => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    await (window as any).aistudio.openSelectKey();
  }
};

// Main generation function
export const generateVeoVideo = async (
  imageBase64: string,
  config: GenerationConfig
): Promise<string> => {
  // 1. Initialize Client (Assumes API Key is injected or selected via window.aistudio)
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please select a key.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // 2. Construct Prompt
  let prompt = `Create a hyper-realistic cinematic video from this image. `;
  
  if (config.identityLock) {
    prompt += `Preserve exact face, identity, and clothing. Do NOT change the face or features. `;
  }

  prompt += `Apply a ${config.motion} camera movement. `;
  prompt += `The video duration should be ${config.videoLength} seconds. `;
  prompt += `Lighting should be ${config.atmosphere}. `;
  prompt += `Include subtle motion details: ${config.sceneMotion}. `;
  prompt += `Use natural lighting and maintain original style. No distortions or hallucinations.`;

  // 3. Clean up Base64 string (remove header if present)
  const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

  // 4. Call Veo Model
  // Note: VEO supports 16:9 and 9:16. If 1:1 is passed, we map to 16:9 or closest supported.
  // Here we stick to strictly supported types.
  const validAspectRatio = config.aspectRatio === AspectRatio.SQUARE 
    ? '16:9' // Fallback for 1:1 as it's not natively supported in Veo preview yet usually
    : config.aspectRatio;

  console.log("Starting generation with prompt:", prompt);

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview', // Using fast preview for better UX in demo
      prompt: prompt,
      image: {
        imageBytes: cleanBase64,
        mimeType: 'image/png', // Assuming PNG/JPEG converted to base64 usually behaves well
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p', // Fast preview supports 720p
        aspectRatio: validAspectRatio as '16:9' | '9:16',
      }
    });

    // 5. Poll for completion
    // Veo generation takes time. We poll every 5 seconds.
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      console.log("Polling status...", operation.metadata);
    }

    // 6. Retrieve Result
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!videoUri) {
      throw new Error("Video generation completed but no URI was returned.");
    }

    // 7. Fetch the actual blob (requires API key appended)
    const videoUrlWithKey = `${videoUri}&key=${process.env.API_KEY}`;
    
    // We fetch it to create a local blob URL for smoother playback/download without exposing the key in the UI src
    const response = await fetch(videoUrlWithKey);
    if (!response.ok) {
        throw new Error(`Failed to download video bytes: ${response.statusText}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error: any) {
    console.error("Veo Generation Error:", error);
    if (error.message && error.message.includes("Requested entity was not found")) {
         // Key issue
         throw new Error("API Key Error: Please re-select your API key.");
    }
    throw error;
  }
};
// Import Hugging Face official inference client
import { HfInference } from "@huggingface/inference";

// Initialize client with API key from environment variables
// ⚠️ Make sure HUGGING_API_KEY is defined in your .env file
const hf = new HfInference(process.env.HUGGING_API_KEY);

/**
 * Sends a prompt to the HuggingFace chat model
 * and returns the assistant's structured response.
 *
 * @param prompt - Fully constructed instruction string
 * @returns Assistant message object (role + content)
 */
const queryModel = async (prompt: string): Promise<any> => {
  try {

    // Call chatCompletion API
    // Using instruct-tuned model for structured output
    const result = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "user", // We are sending a user instruction
          content: prompt
        }
      ],
    });

    // Return only the assistant message (not full response metadata)
    return result.choices[0].message;

  } catch (error) {

    // Log detailed error for debugging (remove in production if sensitive)
    console.error("HuggingFace Error:", error);

    // Throw clean error for upper service layer
    throw new Error("HuggingFace API failed");
  }
};

export default queryModel;

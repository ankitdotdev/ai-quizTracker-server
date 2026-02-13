"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const genai_1 = require("@google/genai");
const errorHandler_1 = __importDefault(require("../../middleware/errorHandler"));
class AIService {
    static async generateSpec(prompt) {
        try {
            const response = await this.ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
            });
            return response.text ?? "";
        }
        catch (error) {
            console.error("Gemini Error:", error);
            throw new errorHandler_1.default(500, "AI generation failed");
        }
    }
}
exports.AIService = AIService;
AIService.ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

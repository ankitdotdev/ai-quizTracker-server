"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPrompt = void 0;
const buildPrompt = (data) => {
    return `
You are a backend JSON generator.

Your task is to return STRICTLY VALID JSON.
Do NOT return markdown.
Do NOT return code blocks.
Do NOT return explanations.
Do NOT wrap in \`\`\`.
Return raw JSON only.

Generate a structured engineering plan based on the following feature details:

Feature Title: ${data.title}
Goal: ${data.goal}
Target Users: ${data.targetUsers}
Platform Type: ${data.platformType}
Constraints: ${data.constraints}
Tech Preference: ${data.techPreference}
Risk Sensitivity: ${data.riskSensitivity}

The response MUST strictly match this JSON schema:

{
  "userStories": [
    {
      "title": "string",
      "description": "string"
    }
  ],
  "engineeringTasks": [
    {
      "category": "Backend | Frontend | Database | DevOps",
      "task": "string"
    }
  ],
  "risks": [
    "string"
  ],
  "unknowns": [
    "string"
  ]
}

Hard Requirements:
- Response must be valid JSON.
- No trailing commas.
- No comments.
- No extra fields.
- No text before or after JSON.
- "category" must be exactly one of: Backend, Frontend, Database, DevOps.
- Keep output implementation-focused and realistic.
`;
};
exports.buildPrompt = buildPrompt;

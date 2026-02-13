import ThrowError from "../../../middleware/errorHandler";
import { GenerateSpecInput, PlatformType, RiskSensitivity } from "../model/specs.model";

class SpecsValidator {
  static  validateInput(data: unknown): GenerateSpecInput {
    if (!data || typeof data !== "object") {
      throw new ThrowError(400, "Invalid request body");
    }

    const {
      title,
      goal,
      targetUsers,
      platformType,
      constraints,
      techPreference,
      riskSensitivity,
      ...extraFields
    } = data as Record<string, unknown>;

    // 🚨 Reject unknown fields
    if (Object.keys(extraFields).length > 0) {
      throw new ThrowError(400, "Unknown fields are not allowed");
    }

    // Required validations
    if (!title || typeof title !== "string" || !title.trim()) {
      throw new ThrowError(400, "Title is required");
    }

    if (!goal || typeof goal !== "string" || !goal.trim()) {
      throw new ThrowError(400, "Goal is required");
    }

    if (
      !targetUsers ||
      typeof targetUsers !== "string" ||
      !targetUsers.trim()
    ) {
      throw new ThrowError(400, "Target users is required");
    }

    const allowedPlatforms: PlatformType[] = [
      "web",
      "mobile",
      "internal-tool",
      "api",
    ];

    if (!allowedPlatforms.includes(platformType as PlatformType)) {
      throw new ThrowError(400, "Invalid platform type");
    }

    const allowedRisk: RiskSensitivity[] = ["low", "medium", "high"];

    if (
      riskSensitivity &&
      !allowedRisk.includes(riskSensitivity as RiskSensitivity)
    ) {
      throw new ThrowError(400, "Invalid risk sensitivity value");
    }

    // ✅ Construct clean validated body
    const validatedBody: GenerateSpecInput = {
      title: title.trim(),
      goal: goal.trim(),
      targetUsers: targetUsers.trim(),
      platformType: platformType as PlatformType,
      ...(constraints && typeof constraints === "string"
        ? { constraints: constraints.trim() }
        : {}),
      ...(techPreference && typeof techPreference === "string"
        ? { techPreference: techPreference.trim() }
        : {}),
      ...(riskSensitivity
        ? { riskSensitivity: riskSensitivity as RiskSensitivity }
        : {}),
    };

    return validatedBody;
  }
}

export default SpecsValidator;

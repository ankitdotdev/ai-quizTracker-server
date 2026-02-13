"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecRepository = void 0;
const mongodb_1 = require("mongodb");
const dbConnection_1 = __importDefault(require("../../../config/dbConnection"));
const errorHandler_1 = __importDefault(require("../../../middleware/errorHandler"));
class SpecRepository {
    /**
     * Persists spec input and its corresponding AI-generated output.
     *
     * Handles:
     * - New spec creation (version = 1)
     * - Regeneration of existing spec (increment version)
     * - Versioned output storage
     */
    static async storeInputOutputOfSpec(inputData, outputData, userId, specInputId) {
        const db = dbConnection_1.default.getDB();
        // Collections for input metadata and versioned outputs
        const inputCollection = db.collection("specs_input");
        const outputCollection = db.collection("specs_output");
        // Ensure user context exists
        if (!userId) {
            throw new errorHandler_1.default(400, "User ID is required");
        }
        let finalSpecInputId;
        let version = 1;
        /**
         * Case 1: New Spec Creation
         * - Insert input document
         * - Initialize version to 1
         */
        if (!specInputId) {
            const inputInsertResult = await inputCollection.insertOne({
                userId: new mongodb_1.ObjectId(userId),
                ...inputData,
                createdAt: new Date(),
            });
            if (!inputInsertResult.insertedId) {
                throw new errorHandler_1.default(500, "Failed to store spec input");
            }
            finalSpecInputId = inputInsertResult.insertedId;
            version = 1;
        }
        else {
            /**
             * Case 2: Regeneration of Existing Spec
             * - Validate ownership
             * - Increment version based on existing outputs
             */
            finalSpecInputId = new mongodb_1.ObjectId(specInputId);
            // Verify spec belongs to user
            const existingInput = await inputCollection.findOne({
                _id: finalSpecInputId,
                userId: new mongodb_1.ObjectId(userId),
            });
            if (!existingInput) {
                throw new errorHandler_1.default(404, "Spec input not found");
            }
            // Determine next version number
            const existingVersionsCount = await outputCollection.countDocuments({
                specInputId: finalSpecInputId,
            });
            version = existingVersionsCount + 1;
        }
        /**
         * Insert Versioned Output
         * - Each regeneration creates a new version
         * - Input remains immutable
         */
        const outputInsertResult = await outputCollection.insertOne({
            specInputId: finalSpecInputId,
            version,
            output: outputData,
            generatedAt: new Date(),
        });
        if (!outputInsertResult.insertedId) {
            throw new errorHandler_1.default(500, "Failed to store spec output");
        }
        // Return identifiers and version metadata
        return {
            inputId: finalSpecInputId.toString(),
            outputId: outputInsertResult.insertedId.toString(),
            version,
        };
    }
    static async getSpecList(userId) {
        const specInputCollection = dbConnection_1.default.getDB().collection("specs_input");
        const data = await specInputCollection
            .find({ userId: new mongodb_1.ObjectId(userId) }, { projection: { _id: 1, title: 1 } })
            .sort({ _id: -1 }) // optional: newest first
            .limit(5)
            .toArray();
        return data;
    }
}
exports.SpecRepository = SpecRepository;
exports.default = SpecRepository;

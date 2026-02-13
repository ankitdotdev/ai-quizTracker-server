"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_handler_1 = require("../utils/response.handler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthMiddleware {
    static async validateToken(req, res, next) {
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        if (!authHeader) {
            return (0, response_handler_1.sendError)(res, 401, "Auth header is missing");
        }
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return (0, response_handler_1.sendError)(res, 401, "Invalid authorization format");
        }
        const token = parts[1];
        if (!token) {
            return (0, response_handler_1.sendError)(res, 401, "Token is missing");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            req.user = {
                userId: decoded.userId,
            };
            next();
        }
        catch (error) {
            console.log(error);
            return (0, response_handler_1.sendError)(res, 401, "Invalid or expired token");
        }
    }
}
exports.default = AuthMiddleware;

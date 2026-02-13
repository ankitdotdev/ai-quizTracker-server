import { NextFunction, Request, Response } from "express";

import { sendError } from "../utils/response.handler";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

class AuthMiddleware {
  static async validateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    console.log(authHeader);
    if (!authHeader) {
      return sendError(res, 401, "Auth header is missing");
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return sendError(res, 401, "Invalid authorization format");
    }

    const token = parts[1];

    if (!token) {
      return sendError(res, 401, "Token is missing");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
        userId: string;
      };

      req.user = {
        userId: decoded.userId,
      };

      next();
    } catch (error) {
      console.log(error);
      return sendError(res, 401, "Invalid or expired token");
    }
  }
}

export default AuthMiddleware;

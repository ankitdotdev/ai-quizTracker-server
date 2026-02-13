"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const specs_controller_1 = __importDefault(require("../controller/specs.controller"));
const specsRouter = (0, express_1.Router)();
// specsRouter.get("/specs")
specsRouter.post("/generate", specs_controller_1.default.generateSpecs);
exports.default = specsRouter;

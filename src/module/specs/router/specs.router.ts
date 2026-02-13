import { Router } from "express";
import SpecsController from "../controller/specs.controller";
import AuthMiddleware from "../../../middleware/authMiddleware";

const specsRouter = Router();

specsRouter.use(AuthMiddleware.validateToken);
specsRouter.get("/", SpecsController.getSpecsList);
specsRouter.post("/generate", SpecsController.generateSpecs);

export default specsRouter;

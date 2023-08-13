import { Router } from "express";
import { create, getMoreComment } from "../controllers/comment";
import { validateJWT } from "../middlewares/validateJWT";
const commentRouter = Router();

commentRouter.post("/", [validateJWT], create);
commentRouter.post("/more", [validateJWT], getMoreComment);

export default commentRouter;

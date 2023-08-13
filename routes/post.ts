import { Router } from "express";
import { check } from "express-validator";
import {
  addLike,
  create,
  getAll,
  getByID,
  getByUserId,
  getExplore,
  getHome,
  removeLike,
} from "../controllers/post";

import { validateJWT } from "../middlewares/validateJWT";

const postRouter = Router();

postRouter.get("/", [validateJWT], getAll);
postRouter.get("/:id", [validateJWT], getByID);
postRouter.get("/user/:id/:skip", [validateJWT], getByUserId);

postRouter.get("/home/list/:skip", [validateJWT], getHome);
postRouter.get("/feed/list/:skip", [validateJWT], getExplore);

postRouter.post("/", [validateJWT], create);
postRouter.put("/add/like", [validateJWT], addLike);
postRouter.put("/remove/like", [validateJWT], removeLike);

export default postRouter;

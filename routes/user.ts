import { Router } from "express";
import { check } from "express-validator";
import {
  addFollow,
  create,
  getAll,
  getByID,
  getUserByQuery,
  removeFollow,
  update,
} from "../controllers/user";

import { fieldsValidate } from "../middlewares/fieldsValidate";
import { validateJWT } from "../middlewares/validateJWT";

const userRouter = Router();

userRouter.get("/", [validateJWT], getAll);

userRouter.get("/:id", [validateJWT], getByID);
userRouter.post(
  "/",
  [
    check("username", "User is required ").trim().notEmpty(),
    check("username", "User must be string ").isString(),
    check("password", "Password is required").trim().notEmpty(),
    check("password", "Password must be string").isString(),
    fieldsValidate,
  ],
  create
);
userRouter.put("/", [validateJWT], update);
userRouter.put("/add/follow", [validateJWT], addFollow);
userRouter.put("/remove/follow", [validateJWT], removeFollow);
userRouter.get("/find/:query", [validateJWT], getUserByQuery);

export default userRouter;

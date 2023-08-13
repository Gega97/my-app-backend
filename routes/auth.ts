import { Router } from "express";
import { check } from "express-validator";
import { login, registry } from "../controllers/auth";
import { fieldsValidate } from "../middlewares/fieldsValidate";

const authRouter = Router();

authRouter.post(
  "/login",
  [
    check("username", "User is required ").trim().notEmpty(),
    check("username", "User must be string ").isString(),
    check("password", "Password is required").trim().notEmpty(),
    check("password", "Password must be string").isString(),
    fieldsValidate,
  ],
  login
);

authRouter.post(
  "/registry",
  [
    check("username", "User is required ").trim().notEmpty(),
    check("username", "User must be string ").isString(),
    check("password", "Password is required").trim().notEmpty(),
    check("password", "Password must be string").isString(),
    fieldsValidate,
  ],
  registry
);
export default authRouter;

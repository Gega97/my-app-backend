import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const validateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("my-app-token");

  if (!token) {
    return res.status(401).json({
      data: {
        msg: "Not token provided",
      },
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET || "myappsecret");
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      data: {
        msg: "not valid token",
      },
    });
  }
};

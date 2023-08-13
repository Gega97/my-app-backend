import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

import userModel from "../models/user";
import { generateJWT } from "../helpers/generateJWT";

export const login = async (req: Request, res: Response) => {
  try {
    const user = await userModel
      .findOne({ username: req.body.username })
      .select("-createdAt -updatedAt");
    if (!user) {
      return res.status(400).json({
        msg: "bad request",
      });
    }

    const validatePassword = bcryptjs.compareSync(
      req.body.password,
      user.password
    );
    if (!validatePassword) {
      return res.status(400).json({
        msg: "bad request",
      });
    }

    const {
      _id,
      username,
      socialNetwork,
      followers,
      follows,
      avatar,
      banner,
      email,
    } = user;

    const token = await generateJWT(user.username, user._id.toString());

    res.status(200).json({
      msg: "login success",
      user: {
        _id,
        username,
        socialNetwork,
        followers,
        follows,
        avatar,
        banner,
        email,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: "Internal err in login()",
    });
  }
};

export const registry = async (req: Request, res: Response) => {
  try {
    const user = await userModel
      .findOne({ username: req.body.username })
      .select("-createdAt -updatedAt");
    if (user) {
      return res.status(400).json({
        msg: "user already exist",
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        msg: "passwords not match",
      });
    }

    const salt = bcryptjs.genSaltSync();
    const hashPassword = bcryptjs.hashSync(req.body.password, salt);
    const newUser = await userModel.create({
      username: req.body.username,
      password: hashPassword,
      follows: [],
      followers: [],
    });

    const { _id, username, followers, follows } = newUser;
    const token = await generateJWT(username, _id.toString());
    res.status(200).json({
      msg: "registry success",
      user: {
        _id,
        username,
        followers,
        follows,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in login()",
    });
  }
};

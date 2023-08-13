import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/user";
import { ObjectId } from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await userModel
      .find({})
      .select("-createdAt -updatedAt -password");

    res.status(200).json({
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in getAll()",
    });
  }
};

export const getByID = async (req: Request, res: Response) => {
  try {
    const user = await userModel
      .findOne({ _id: req.params.id })
      .select("-createdAt -updatedAt -password");
    if (!user) {
      return res.status(400).json({
        msg: "user not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in getAll()",
    });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).json({
        msg: "already exist",
      });
    } else {
      const salt = bcryptjs.genSaltSync();
      const hashPassword = bcryptjs.hashSync(req.body.password, salt);
      const newUser = await userModel.create({
        username: req.body.username,
        password: hashPassword,
        follows: [],
        followers: [],
      });

      const { username, followers, follows } = newUser;

      res.status(200).json({
        msg: "created success",
        user: {
          username,
          followers,
          follows,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in create()",
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const user = await userModel
      .findOne({ _id: req.body._id })
      .select("-createdAt -updatedAt -password");

    if (!user) {
      return res.status(404).json({
        msg: "user not found",
      });
    }
    user.username = req.body.username;
    user.email = req.body.email;
    user.description = req.body.description;
    user.lastname = req.body.lastname;
    user.name = req.body.name;
    if (req.files && req.files.file) {
      if (user.avatar) {
        const nameSplit = user.avatar.split("/");
        const lastPosition = nameSplit[nameSplit.length - 1];
        const [cloudId] = lastPosition.split(".");
        cloudinary.uploader.destroy(cloudId);
      }

      const file = Array.isArray(req.files.file)
        ? req.files.file[0]
        : req.files.file;
      const { secure_url } = await cloudinary.uploader.upload(
        file.tempFilePath
      );
      user.avatar = secure_url;
    }

    await user.save();
    res.status(200).json({
      msg: "update user action success",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in update()",
    });
  }
};

export const addFollow = async (req: Request, res: Response) => {
  try {
    const user = await userModel
      .findOne({ _id: req.body._id })
      .select("-createdAt -updatedAt -password");

    const userToFollow = await userModel
      .findOne({ _id: req.body._idFollow })
      .select("-createdAt -updatedAt -password");

    if (!user || !userToFollow) {
      return res.status(400).json({
        msg: "Some user is invalid",
        user,
      });
    }

    user.follows.push(userToFollow._id.toString());
    userToFollow.followers.push(user._id.toString());

    await user.save();
    await userToFollow.save();

    res.status(200).json({
      msg: "follow action success",
      user,
      userToFollow,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in addFollow()",
    });
  }
};

export const removeFollow = async (req: Request, res: Response) => {
  try {
    const user = await userModel
      .findOne({ _id: req.body._id })
      .select("-createdAt -updatedAt -password");

    const userRemoveFollow = await userModel
      .findOne({ _id: req.body._idFollow })
      .select("-createdAt -updatedAt -password");

    if (!user || !userRemoveFollow) {
      return res.status(400).json({
        msg: "Some user is invalid",
        user,
      });
    }

    const filterFollows = user.follows.filter(
      (username) => username !== userRemoveFollow._id.toString()
    );
    const filterFollowersToFollow = userRemoveFollow.followers.filter(
      (username) => username !== user._id.toString()
    );
    user.follows = filterFollows;
    userRemoveFollow.followers = filterFollowersToFollow;

    await user.save();
    await userRemoveFollow.save();

    res.status(200).json({
      msg: "unfollow action success",
      user,
      userRemoveFollow,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in addFollow()",
    });
  }
};

export const getUserByQuery = async (req: Request, res: Response) => {
  try {
    const regex = new RegExp(req.params.query, "i");
    const users = await userModel.find({
      $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }],
    });
    console.log(users);
    res.status(200).json({
      users,
    });
    // const users = await
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in getUsersByQuery()",
    });
  }
};

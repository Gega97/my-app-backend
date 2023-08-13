import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

// import userModel from "../models/user";
import postModel from "../models/post";
import user from "../models/user";
import comment from "../models/comment";

const ObjectId = require("mongoose").Types.ObjectId;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const getAll = async (req: Request, res: Response) => {
  try {
    const posts = await postModel
      .find({})
      .populate({
        path: "user",
        model: user,
        select: "username avatar _id",
      })
      .sort({ createdAt: -1 });
    res.status(200).json({
      posts,
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
    const post = await postModel
      .findOne({
        _id: req.params.id,
      })
      .populate({
        path: "user",
        model: user,
        select: "username avatar _id",
      })
      .populate({
        path: "comments",
        model: comment,
        options: { limit: 3 },
        select: "_id content likes user",
        populate: {
          path: "user",
          model: user,
          select: "username avatar",
        },
      })
      .sort({ createdAt: -1 });
    res.status(200).json({
      post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in getAll()",
    });
  }
};

export const getByUserId = async (req: Request, res: Response) => {
  try {
    const posts = await postModel
      .find({
        user: req.params.id,
      })
      .populate({
        path: "user",
        model: user,
        select: "username avatar _id",
      })
      .populate({
        path: "comments",
        model: comment,
        options: { limit: 3 },
        select: "_id content likes user",
        populate: {
          path: "user",
          model: user,
          select: "username avatar",
        },
      })
      .limit(10)
      .skip(Number(req.params.skip))

      .sort({ createdAt: -1 });

    const nextPosts = await postModel
      .find({
        user: req.params.id,
      })
      .skip(Number(req.params.skip) + 10) // Salto adicional para verificar si existen más documentos
      .limit(1);

    const totalDocuments = await postModel.countDocuments({
      user: req.params.id,
    });

    res.status(200).json({
      posts,
      isNext: nextPosts.length > 0 ? true : false,
      totalPost: totalDocuments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in getAll()",
    });
  }
};

export const getHome = async (req: Request, res: Response) => {
  try {
    const currentUser = await user.findOne({
      _id: new ObjectId(req.user._id),
    });
    const follows: String[] | undefined = currentUser?.follows;
    follows?.push(req.user._id);
    const posts = await postModel
      .find({})
      .populate({
        path: "user",
        model: user,
        select: "username avatar follows",
      })
      .populate({
        path: "comments",
        model: comment,
        options: { limit: 3 },
        select: "_id content likes user",
        populate: {
          path: "user",
          model: user,
          select: "username avatar",
        },
      })
      .where("user")
      .in(follows || [])
      .limit(10)
      .skip(Number(req.params.skip))
      .sort({ createdAt: -1 });

    const postsWithTotalComments = await postModel
      .find({})
      .where("user")
      .in(follows || [])
      .limit(10)
      .skip(Number(req.params.skip))
      .sort({ createdAt: -1 });

    const nextPosts = await postModel
      .find({})
      .where("user")
      .in(follows || [])
      .skip(Number(req.params.skip) + 10) // Salto adicional para verificar si existen más documentos
      .limit(1);

    const newPosts = posts.map((el) => {
      const currentPost = postsWithTotalComments.find(
        (value) => value._id.toString() == el._id.toString()
      );
      if (currentPost) {
        el.totalComments = currentPost.comments.length;
        return el;
      }
    });
    res.status(200).json({
      posts: newPosts,
      isNext: nextPosts.length > 0 ? true : false,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in getHome()",
    });
  }
};

export const getExplore = async (req: Request, res: Response) => {
  try {
    const currentUser = await user.findOne({
      _id: new ObjectId(req.user._id),
    });
    const follows: String[] | undefined = currentUser?.follows;
    follows?.push(req.user._id);
    const posts = await postModel
      .find({})
      .populate({
        path: "user",
        model: user,
        select: "username avatar follows",
      })
      .where("user")
      .limit(10)
      .skip(Number(req.params.skip))
      .nin(follows || [])
      .sort({ createdAt: -1 });

    const nextPosts = await postModel
      .find({})
      .where("user")
      .nin(follows || [])
      .skip(Number(req.params.skip) + 10) // Salto adicional para verificar si existen más documentos
      .limit(1)
      .sort({ createdAt: -1 });

    res.status(200).json({
      posts,
      isNext: nextPosts.length > 0 ? true : false,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in getExplore()",
    });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    let image: string = "";
    if (req.files && req.files.file) {
      const file = Array.isArray(req.files.file)
        ? req.files.file[0]
        : req.files.file;
      const { secure_url } = await cloudinary.uploader.upload(
        file.tempFilePath
      );

      image = secure_url;
    }
    const newPost = await postModel.create({
      description: req.body.description,
      image,
      user: req.body._id,
      totalComments: 0,
    });
    res.status(200).json({
      newPost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in create()",
    });
  }
};

export const addLike = async (req: Request, res: Response) => {
  try {
    const post = await postModel
      .findOne({
        _id: req.body._id,
      })
      .populate({
        path: "user",
        model: user,
        select: "username avatar",
      })
      .populate({
        path: "comments",
        model: comment,
        options: { limit: 3 },
        select: "_id content likes user",
        populate: {
          path: "user",
          model: user,
          select: "username avatar",
        },
      });

    post?.likes.push(req.body.userId.toString());
    await post?.save();
    res.status(200).json({
      post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in addLike()",
    });
  }
};

export const removeLike = async (req: Request, res: Response) => {
  try {
    const post = await postModel
      .findOne({
        _id: req.body._id,
      })
      .populate({
        path: "user",
        model: user,
        select: "username avatar",
      })
      .populate({
        path: "comments",
        model: comment,
        options: { limit: 3 },
        select: "_id content likes user",
        populate: {
          path: "user",
          model: user,
          select: "username avatar",
        },
      });
    const index = post?.likes.findIndex(
      (el) => el === req.body.userId.toString()
    );
    if (index !== undefined) post?.likes.splice(index, 1);
    console.log(post, "POST");

    await post?.save();
    res.status(200).json({
      post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in addLike()",
    });
  }
};

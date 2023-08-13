import { Request, Response } from "express";

import postModel from "../models/post";
import user from "../models/user";
import comment from "../models/comment";
const ObjectId = require("mongoose").Types.ObjectId;

export const create = async (req: Request, res: Response) => {
  try {
    const newComment = await comment.create({
      user: req.user._id,
      content: {
        image: req.body.image,
        text: req.body.text,
      },
    });
    if (req.body.isPost) {
      const post = await postModel.findOne({
        _id: req.body.postId,
      });
      if (post) {
        post.comments.push(new ObjectId(newComment._id));
        post.totalComments = post?.comments.length;
        await post?.save();
        const populatedPost = await postModel
          .findOne({ _id: post?._id })
          .populate({
            path: "user",
            model: user,
            select: "username avatar follows",
          })
          .populate({
            path: "comments",
            model: comment,
            populate: {
              path: "user",
              model: user,
              select: "username avatar",
            },
          });
        res.status(200).json({
          post: populatedPost,
          newComment,
          currentComment: undefined,
        });
      } else {
        res.status(404).json({
          msg: "Post not found",
        });
      }
    } else {
      const currentComment = await comment.findOne({
        _id: req.body.commentId,
      });
      currentComment?.comments.push(new ObjectId(req.body.commentId));
      res.status(200).json({
        currentComment,
        newComment,
        post: undefined,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in create()",
    });
  }
};

export const getMoreComment = async (req: Request, res: Response) => {
  try {
    const post = await postModel.findOne({ _id: req.body.postId }).populate({
      path: "comments",
      model: comment,
      options: { limit: 3, skip: req.body.skip },
      select: "_id content likes user",
      populate: {
        path: "user",
        model: user,
        select: "username avatar",
      },
    });
    console.log(post?.comments);
    if (!post) {
      return res.status(404).json({
        msg: "post not found",
      });
    }
    res.status(200).json({
      post,
      isNext: post.comments.length < 3 ? false : true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal err in getMoreComment()",
    });
  }
};

// export const getByID = async (req: Request, res: Response) => {
//   try {
//     const posts = await postModel
//       .find({
//         user: req.params.id,
//       })
//       .populate({
//         path: "user",
//         model: user,
//         select: "username avatar _id",
//       })
//       .sort({ createdAt: -1 });
//     res.status(200).json({
//       posts,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       msg: "Internal err in getAll()",
//     });
//   }
// };

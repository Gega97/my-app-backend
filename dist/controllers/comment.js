"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoreComment = exports.create = void 0;
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const comment_1 = __importDefault(require("../models/comment"));
const ObjectId = require("mongoose").Types.ObjectId;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newComment = yield comment_1.default.create({
            user: req.user._id,
            content: {
                image: req.body.image,
                text: req.body.text,
            },
        });
        if (req.body.isPost) {
            const post = yield post_1.default.findOne({
                _id: req.body.postId,
            });
            if (post) {
                post.comments.push(new ObjectId(newComment._id));
                post.totalComments = post === null || post === void 0 ? void 0 : post.comments.length;
                yield (post === null || post === void 0 ? void 0 : post.save());
                const populatedPost = yield post_1.default
                    .findOne({ _id: post === null || post === void 0 ? void 0 : post._id })
                    .populate({
                    path: "user",
                    model: user_1.default,
                    select: "username avatar follows",
                })
                    .populate({
                    path: "comments",
                    model: comment_1.default,
                    populate: {
                        path: "user",
                        model: user_1.default,
                        select: "username avatar",
                    },
                });
                res.status(200).json({
                    post: populatedPost,
                    newComment,
                    currentComment: undefined,
                });
            }
            else {
                res.status(404).json({
                    msg: "Post not found",
                });
            }
        }
        else {
            const currentComment = yield comment_1.default.findOne({
                _id: req.body.commentId,
            });
            currentComment === null || currentComment === void 0 ? void 0 : currentComment.comments.push(new ObjectId(req.body.commentId));
            res.status(200).json({
                currentComment,
                newComment,
                post: undefined,
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in create()",
        });
    }
});
exports.create = create;
const getMoreComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.default.findOne({ _id: req.body.postId }).populate({
            path: "comments",
            model: comment_1.default,
            options: { limit: 3, skip: req.body.skip },
            select: "_id content likes user",
            populate: {
                path: "user",
                model: user_1.default,
                select: "username avatar",
            },
        });
        console.log(post === null || post === void 0 ? void 0 : post.comments);
        if (!post) {
            return res.status(404).json({
                msg: "post not found",
            });
        }
        res.status(200).json({
            post,
            isNext: post.comments.length < 3 ? false : true,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in getMoreComment()",
        });
    }
});
exports.getMoreComment = getMoreComment;
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
//# sourceMappingURL=comment.js.map
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
exports.removeLike = exports.addLike = exports.create = exports.getExplore = exports.getHome = exports.getByUserId = exports.getByID = exports.getAll = void 0;
const cloudinary_1 = require("cloudinary");
// import userModel from "../models/user";
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const comment_1 = __importDefault(require("../models/comment"));
const ObjectId = require("mongoose").Types.ObjectId;
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default
            .find({})
            .populate({
            path: "user",
            model: user_1.default,
            select: "username avatar _id",
        })
            .sort({ createdAt: -1 });
        res.status(200).json({
            posts,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in getAll()",
        });
    }
});
exports.getAll = getAll;
const getByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.default
            .findOne({
            _id: req.params.id,
        })
            .populate({
            path: "user",
            model: user_1.default,
            select: "username avatar _id",
        })
            .populate({
            path: "comments",
            model: comment_1.default,
            options: { limit: 3 },
            select: "_id content likes user",
            populate: {
                path: "user",
                model: user_1.default,
                select: "username avatar",
            },
        })
            .sort({ createdAt: -1 });
        res.status(200).json({
            post,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in getAll()",
        });
    }
});
exports.getByID = getByID;
const getByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default
            .find({
            user: req.params.id,
        })
            .populate({
            path: "user",
            model: user_1.default,
            select: "username avatar _id",
        })
            .populate({
            path: "comments",
            model: comment_1.default,
            options: { limit: 3 },
            select: "_id content likes user",
            populate: {
                path: "user",
                model: user_1.default,
                select: "username avatar",
            },
        })
            .limit(10)
            .skip(Number(req.params.skip))
            .sort({ createdAt: -1 });
        const nextPosts = yield post_1.default
            .find({
            user: req.params.id,
        })
            .skip(Number(req.params.skip) + 10) // Salto adicional para verificar si existen más documentos
            .limit(1);
        const totalDocuments = yield post_1.default.countDocuments({
            user: req.params.id,
        });
        res.status(200).json({
            posts,
            isNext: nextPosts.length > 0 ? true : false,
            totalPost: totalDocuments,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in getAll()",
        });
    }
});
exports.getByUserId = getByUserId;
const getHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_1.default.findOne({
            _id: new ObjectId(req.user._id),
        });
        const follows = currentUser === null || currentUser === void 0 ? void 0 : currentUser.follows;
        follows === null || follows === void 0 ? void 0 : follows.push(req.user._id);
        const posts = yield post_1.default
            .find({})
            .populate({
            path: "user",
            model: user_1.default,
            select: "username avatar follows",
        })
            .populate({
            path: "comments",
            model: comment_1.default,
            options: { limit: 3 },
            select: "_id content likes user",
            populate: {
                path: "user",
                model: user_1.default,
                select: "username avatar",
            },
        })
            .where("user")
            .in(follows || [])
            .limit(10)
            .skip(Number(req.params.skip))
            .sort({ createdAt: -1 });
        const postsWithTotalComments = yield post_1.default
            .find({})
            .where("user")
            .in(follows || [])
            .limit(10)
            .skip(Number(req.params.skip))
            .sort({ createdAt: -1 });
        const nextPosts = yield post_1.default
            .find({})
            .where("user")
            .in(follows || [])
            .skip(Number(req.params.skip) + 10) // Salto adicional para verificar si existen más documentos
            .limit(1);
        const newPosts = posts.map((el) => {
            const currentPost = postsWithTotalComments.find((value) => value._id.toString() == el._id.toString());
            if (currentPost) {
                el.totalComments = currentPost.comments.length;
                return el;
            }
        });
        res.status(200).json({
            posts: newPosts,
            isNext: nextPosts.length > 0 ? true : false,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in getHome()",
        });
    }
});
exports.getHome = getHome;
const getExplore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_1.default.findOne({
            _id: new ObjectId(req.user._id),
        });
        const follows = currentUser === null || currentUser === void 0 ? void 0 : currentUser.follows;
        follows === null || follows === void 0 ? void 0 : follows.push(req.user._id);
        const posts = yield post_1.default
            .find({})
            .populate({
            path: "user",
            model: user_1.default,
            select: "username avatar follows",
        })
            .where("user")
            .limit(10)
            .skip(Number(req.params.skip))
            .nin(follows || [])
            .sort({ createdAt: -1 });
        const nextPosts = yield post_1.default
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in getExplore()",
        });
    }
});
exports.getExplore = getExplore;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let image = "";
        if (req.files && req.files.file) {
            const file = Array.isArray(req.files.file)
                ? req.files.file[0]
                : req.files.file;
            const { secure_url } = yield cloudinary_1.v2.uploader.upload(file.tempFilePath);
            image = secure_url;
        }
        const newPost = yield post_1.default.create({
            description: req.body.description,
            image,
            user: req.body._id,
            totalComments: 0,
        });
        res.status(200).json({
            newPost,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in create()",
        });
    }
});
exports.create = create;
const addLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.default
            .findOne({
            _id: req.body._id,
        })
            .populate({
            path: "user",
            model: user_1.default,
            select: "username avatar",
        })
            .populate({
            path: "comments",
            model: comment_1.default,
            options: { limit: 3 },
            select: "_id content likes user",
            populate: {
                path: "user",
                model: user_1.default,
                select: "username avatar",
            },
        });
        post === null || post === void 0 ? void 0 : post.likes.push(req.body.userId.toString());
        yield (post === null || post === void 0 ? void 0 : post.save());
        res.status(200).json({
            post,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in addLike()",
        });
    }
});
exports.addLike = addLike;
const removeLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.default
            .findOne({
            _id: req.body._id,
        })
            .populate({
            path: "user",
            model: user_1.default,
            select: "username avatar",
        })
            .populate({
            path: "comments",
            model: comment_1.default,
            options: { limit: 3 },
            select: "_id content likes user",
            populate: {
                path: "user",
                model: user_1.default,
                select: "username avatar",
            },
        });
        const index = post === null || post === void 0 ? void 0 : post.likes.findIndex((el) => el === req.body.userId.toString());
        if (index !== undefined)
            post === null || post === void 0 ? void 0 : post.likes.splice(index, 1);
        console.log(post, "POST");
        yield (post === null || post === void 0 ? void 0 : post.save());
        res.status(200).json({
            post,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in addLike()",
        });
    }
});
exports.removeLike = removeLike;
//# sourceMappingURL=post.js.map
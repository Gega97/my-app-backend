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
exports.getUserByQuery = exports.removeFollow = exports.addFollow = exports.update = exports.create = exports.getByID = exports.getAll = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("cloudinary");
const user_1 = __importDefault(require("../models/user"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default
            .find({})
            .select("-createdAt -updatedAt -password");
        res.status(200).json({
            users,
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
        const user = yield user_1.default
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in getAll()",
        });
    }
});
exports.getByID = getByID;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ username: req.body.username });
        if (user) {
            return res.status(400).json({
                msg: "already exist",
            });
        }
        else {
            const salt = bcryptjs_1.default.genSaltSync();
            const hashPassword = bcryptjs_1.default.hashSync(req.body.password, salt);
            const newUser = yield user_1.default.create({
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in create()",
        });
    }
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default
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
                cloudinary_1.v2.uploader.destroy(cloudId);
            }
            const file = Array.isArray(req.files.file)
                ? req.files.file[0]
                : req.files.file;
            const { secure_url } = yield cloudinary_1.v2.uploader.upload(file.tempFilePath);
            user.avatar = secure_url;
        }
        yield user.save();
        res.status(200).json({
            msg: "update user action success",
            user,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in update()",
        });
    }
});
exports.update = update;
const addFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default
            .findOne({ _id: req.body._id })
            .select("-createdAt -updatedAt -password");
        const userToFollow = yield user_1.default
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
        yield user.save();
        yield userToFollow.save();
        res.status(200).json({
            msg: "follow action success",
            user,
            userToFollow,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in addFollow()",
        });
    }
});
exports.addFollow = addFollow;
const removeFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default
            .findOne({ _id: req.body._id })
            .select("-createdAt -updatedAt -password");
        const userRemoveFollow = yield user_1.default
            .findOne({ _id: req.body._idFollow })
            .select("-createdAt -updatedAt -password");
        if (!user || !userRemoveFollow) {
            return res.status(400).json({
                msg: "Some user is invalid",
                user,
            });
        }
        const filterFollows = user.follows.filter((username) => username !== userRemoveFollow._id.toString());
        const filterFollowersToFollow = userRemoveFollow.followers.filter((username) => username !== user._id.toString());
        user.follows = filterFollows;
        userRemoveFollow.followers = filterFollowersToFollow;
        yield user.save();
        yield userRemoveFollow.save();
        res.status(200).json({
            msg: "unfollow action success",
            user,
            userRemoveFollow,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in addFollow()",
        });
    }
});
exports.removeFollow = removeFollow;
const getUserByQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const regex = new RegExp(req.params.query, "i");
        const users = yield user_1.default.find({
            $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }],
        });
        console.log(users);
        res.status(200).json({
            users,
        });
        // const users = await
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in getUsersByQuery()",
        });
    }
});
exports.getUserByQuery = getUserByQuery;
//# sourceMappingURL=user.js.map
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
exports.registry = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const generateJWT_1 = require("../helpers/generateJWT");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default
            .findOne({ username: req.body.username })
            .select("-createdAt -updatedAt");
        if (!user) {
            return res.status(400).json({
                msg: "bad request",
            });
        }
        const validatePassword = bcryptjs_1.default.compareSync(req.body.password, user.password);
        if (!validatePassword) {
            return res.status(400).json({
                msg: "bad request",
            });
        }
        const { _id, username, socialNetwork, followers, follows, avatar, banner, email, } = user;
        const token = yield (0, generateJWT_1.generateJWT)(user.username, user._id.toString());
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            err: "Internal err in login()",
        });
    }
});
exports.login = login;
const registry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default
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
        const salt = bcryptjs_1.default.genSaltSync();
        const hashPassword = bcryptjs_1.default.hashSync(req.body.password, salt);
        const newUser = yield user_1.default.create({
            username: req.body.username,
            password: hashPassword,
            follows: [],
            followers: [],
        });
        const { _id, username, followers, follows } = newUser;
        const token = yield (0, generateJWT_1.generateJWT)(username, _id.toString());
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal err in login()",
        });
    }
});
exports.registry = registry;
//# sourceMappingURL=auth.js.map
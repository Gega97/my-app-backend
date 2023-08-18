"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateJWT = (req, res, next) => {
    const token = req.header("my-app-token");
    if (!token) {
        return res.status(401).json({
            data: {
                msg: "Not token provided",
            },
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET || "myappsecret");
        req.user = decoded;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({
            data: {
                msg: "not valid token",
            },
        });
    }
};
exports.validateJWT = validateJWT;
//# sourceMappingURL=validateJWT.js.map
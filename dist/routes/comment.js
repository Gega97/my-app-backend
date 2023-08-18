"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_1 = require("../controllers/comment");
const validateJWT_1 = require("../middlewares/validateJWT");
const commentRouter = (0, express_1.Router)();
commentRouter.post("/", [validateJWT_1.validateJWT], comment_1.create);
commentRouter.post("/more", [validateJWT_1.validateJWT], comment_1.getMoreComment);
exports.default = commentRouter;
//# sourceMappingURL=comment.js.map
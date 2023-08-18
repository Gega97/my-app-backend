"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_1 = require("../controllers/post");
const validateJWT_1 = require("../middlewares/validateJWT");
const postRouter = (0, express_1.Router)();
postRouter.get("/", [validateJWT_1.validateJWT], post_1.getAll);
postRouter.get("/:id", [validateJWT_1.validateJWT], post_1.getByID);
postRouter.get("/user/:id/:skip", [validateJWT_1.validateJWT], post_1.getByUserId);
postRouter.get("/home/list/:skip", [validateJWT_1.validateJWT], post_1.getHome);
postRouter.get("/feed/list/:skip", [validateJWT_1.validateJWT], post_1.getExplore);
postRouter.post("/", [validateJWT_1.validateJWT], post_1.create);
postRouter.put("/add/like", [validateJWT_1.validateJWT], post_1.addLike);
postRouter.put("/remove/like", [validateJWT_1.validateJWT], post_1.removeLike);
exports.default = postRouter;
//# sourceMappingURL=post.js.map
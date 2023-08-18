"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_1 = require("../controllers/user");
const fieldsValidate_1 = require("../middlewares/fieldsValidate");
const validateJWT_1 = require("../middlewares/validateJWT");
const userRouter = (0, express_1.Router)();
userRouter.get("/", [validateJWT_1.validateJWT], user_1.getAll);
userRouter.get("/:id", [validateJWT_1.validateJWT], user_1.getByID);
userRouter.post("/", [
    (0, express_validator_1.check)("username", "User is required ").trim().notEmpty(),
    (0, express_validator_1.check)("username", "User must be string ").isString(),
    (0, express_validator_1.check)("password", "Password is required").trim().notEmpty(),
    (0, express_validator_1.check)("password", "Password must be string").isString(),
    fieldsValidate_1.fieldsValidate,
], user_1.create);
userRouter.put("/", [validateJWT_1.validateJWT], user_1.update);
userRouter.put("/add/follow", [validateJWT_1.validateJWT], user_1.addFollow);
userRouter.put("/remove/follow", [validateJWT_1.validateJWT], user_1.removeFollow);
userRouter.get("/find/:query", [validateJWT_1.validateJWT], user_1.getUserByQuery);
exports.default = userRouter;
//# sourceMappingURL=user.js.map
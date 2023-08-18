"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const fieldsValidate_1 = require("../middlewares/fieldsValidate");
const authRouter = (0, express_1.Router)();
authRouter.post("/login", [
    (0, express_validator_1.check)("username", "User is required ").trim().notEmpty(),
    (0, express_validator_1.check)("username", "User must be string ").isString(),
    (0, express_validator_1.check)("password", "Password is required").trim().notEmpty(),
    (0, express_validator_1.check)("password", "Password must be string").isString(),
    fieldsValidate_1.fieldsValidate,
], auth_1.login);
authRouter.post("/registry", [
    (0, express_validator_1.check)("username", "User is required ").trim().notEmpty(),
    (0, express_validator_1.check)("username", "User must be string ").isString(),
    (0, express_validator_1.check)("password", "Password is required").trim().notEmpty(),
    (0, express_validator_1.check)("password", "Password must be string").isString(),
    fieldsValidate_1.fieldsValidate,
], auth_1.registry);
exports.default = authRouter;
//# sourceMappingURL=auth.js.map
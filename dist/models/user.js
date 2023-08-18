"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    avatar: {
        type: String,
    },
    description: {
        type: String,
    },
    banner: {
        type: String,
    },
    socialNetwork: {
        type: Array,
    },
    followers: {
        type: Array,
        required: true,
        default: [],
    },
    follows: {
        type: Array,
        default: [],
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.default = (0, mongoose_1.model)("UserModel", UserSchema);
//# sourceMappingURL=user.js.map
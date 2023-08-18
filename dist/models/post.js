"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    likes: {
        type: Array,
        required: true,
        default: [],
    },
    shareds: {
        type: Array,
        default: [],
        required: true,
    },
    user: { type: mongoose_1.Types.ObjectId, ref: "user", required: true },
    comments: [{ type: mongoose_1.Types.ObjectId, ref: "comment" }],
    totalComments: { type: Number },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.default = (0, mongoose_1.model)("PostModel", PostSchema);
//# sourceMappingURL=post.js.map
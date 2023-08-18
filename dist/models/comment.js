"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    content: {
        image: {
            type: String,
            required: false,
        },
        text: {
            type: String,
            required: false,
        },
    },
    user: { type: mongoose_1.Types.ObjectId, ref: "user", required: true },
    likes: {
        type: Array,
        required: true,
        default: [],
    },
    comments: [{ type: mongoose_1.Types.ObjectId, ref: "comment" }],
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.default = (0, mongoose_1.model)("CommentModel", CommentSchema);
//# sourceMappingURL=comment.js.map
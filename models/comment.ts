import { Schema, Types, model } from "mongoose";

const CommentSchema = new Schema(
  {
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
    user: { type: Types.ObjectId, ref: "user", required: true },
    likes: {
      type: Array,
      required: true,
      default: [],
    },
    comments: [{ type: Types.ObjectId, ref: "comment" }],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default model("CommentModel", CommentSchema);

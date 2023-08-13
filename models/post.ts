import { Schema, Types, model } from "mongoose";

const PostSchema = new Schema(
  {
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
    user: { type: Types.ObjectId, ref: "user", required: true },
    comments: [{ type: Types.ObjectId, ref: "comment" }],
    totalComments: { type: Number },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default model("PostModel", PostSchema);

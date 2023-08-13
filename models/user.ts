import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default model("UserModel", UserSchema);

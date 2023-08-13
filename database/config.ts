import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL || "mongodb://127.0.0.1/myapp"
    );

    console.log("Online DB");
  } catch (err) {
    console.log(err);
    throw new Error("database connection err");
  }
};



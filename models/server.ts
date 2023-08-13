import Express, { Application } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import { dbConnection } from "../database/config";
import userRouter from "../routes/user";
import authRouter from "../routes/auth";
import postRouter from "../routes/post";
import commentRouter from "../routes/comment";

class Server {
  private app: Application;
  private port: string;

  private apiPaths = {
    users: "/api/users",
    auth: "/api/auth",
    posts: "/api/posts",
    comments: "/api/comments",
  };

  constructor() {
    this.app = Express();

    this.port = process.env.PORT || "8000";
    this.middlewares();
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  routes() {
    this.app.use(this.apiPaths.users, userRouter);
    this.app.use(this.apiPaths.auth, authRouter);
    this.app.use(this.apiPaths.posts, postRouter);
    this.app.use(this.apiPaths.comments, commentRouter);
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(Express.json());
    this.app.use(Express.static("public"));
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
      })
    );
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server up in: ${this.port}!!!`);
    });
  }
}

export default Server;

import jwt from "jsonwebtoken";

export const generateJWT = (username: string, _id: string) => {
  return new Promise((resolve: any, reject: any) => {
    const payload = { username, _id };

    jwt.sign(
      payload,
      process.env.SECRET || "myappsecret",
      {
        expiresIn: "4h",
      },
      (err: any, token: any) => {
        if (err) {
          console.log(err);
          reject("not generated token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

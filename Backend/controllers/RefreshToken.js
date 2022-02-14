import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const RefreshToken = async (req, res) => {
  try {
    const refreshToken = await req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await UserModel.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const user_id = user[0].id;
        const user_name = user[0].name;
        const user_email = user[0].email;
        const accessToken = jwt.sign(
          { user_id, user_name, user_email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

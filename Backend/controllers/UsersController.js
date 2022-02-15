import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Find all Users or By name & email
export const getUsers = async (req, res) => {
  try {
    const column = ["id", "name", "email", "avatar", "createdAt", "updatedAt"];
    const find = req.query;
    let query;
    if ("email" in find) {
      query = {
        where: {
          email: find.email,
        },
        attributes: column,
      };
    } else if ("name" in find) {
      query = {
        where: {
          name: find.name,
        },
        attributes: column,
      };
    } else {
      query = {
        attributes: ["id", "name", "email", "avatar", "createdAt", "updatedAt"],
      };
    }
    const users = await UserModel.findAll(query);
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

// find users by id
export const getUsersId = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await UserModel.findByPk(user_id, {
      attributes: ["id", "name", "email", "avatar", "createdAt", "updatedAt"],
    });
    if (!user)
      return res.status(200).json({
        message: "Data Not Found",
      });
    return res.status(200).json(user);
  } catch (error) {
    res.status(401).json(error);
  }
};

// update user By id
export const updateUserById = async (req, res) => {
  try {
    const user_id = req.params.id;
    await UserModel.update(
      {
        name: req.body.name,
        avatar: req.body.avatar,
      },
      {
        where: {
          id: user_id,
        },
      }
    );
    const user = await UserModel.findByPk(user_id, {
      attributes: ["id", "name", "email", "avatar"],
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json(error);
  }
};

// Delete user By UserId
export const deleteUserById = async (req, res) => {
  try {
    const user_id = req.params.id;
    console.log(user_id);
    await UserModel.destroy({
      where: {
        id: user_id,
      },
    });
    res.status(200).json({ message: "Deleted Succes" });
  } catch (error) {
    res.status(401).json(error);
  }
};

// register user
export const Register = async (req, res) => {
  const { name, email, avatar, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res.status(400).json({ message: "Password not match" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  const userData = {
    name: name,
    email: email,
    avatar: avatar,
    password: hashPassword,
  };
  try {
    await UserModel.create(userData);
    res.json({ msg: "Register Success", data: userData });
  } catch (error) {
    console.log(error);
  }
};

// login user
export const Login = async (req, res) => {
  try {
    const user = await UserModel.findAll({
      where: {
        email: req.body.email,
      },
    });
    if (user.length == 0) return res.json({ message: "Email Not Found" });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ message: "Invalid Credential" });
    const user_id = user[0].id;
    const user_name = user[0].name;
    const user_email = user[0].email;
    const accesToken = jwt.sign(
      { user_id, user_name, user_email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { user_id, user_name, user_email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await UserModel.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: user_id,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accesToken });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await UserModel.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const user_id = user[0].id;
  await UserModel.update(
    { refresh_token: null },
    {
      where: {
        id: user_id,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logout Success" });
};

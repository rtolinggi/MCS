import UserModel from "../models/UserModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

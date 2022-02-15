import express from "express";
import {
  getUsers,
  Login,
  Register,
  Logout,
  getUsersId,
  updateUserById,
  deleteUserById,
} from "../controllers/UsersController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";
import { RefreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/users", VerifyToken, getUsers);
router.get("/users/:id", VerifyToken, getUsersId);
router.post("/users", Register);
router.put("/users/:id", VerifyToken, updateUserById);
router.delete("/users/:id", VerifyToken, deleteUserById);
router.post("/login", Login);
router.get("/token", RefreshToken);
router.delete("/logout", Logout);

export default router;

import express from "express";
import {
  getUsers,
  Login,
  Register,
  Logout,
} from "../controllers/UsersController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";
import { RefreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/users", VerifyToken, getUsers);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", RefreshToken);
router.delete("/logout", Logout);

export default router;

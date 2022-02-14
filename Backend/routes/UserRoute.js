import express from "express";
import { getUsers, Login, Register } from "../controllers/UsersController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/users", VerifyToken, getUsers);
router.post("/users", Register);
router.post("/login", Login);

export default router;

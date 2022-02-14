import express from "express";
import { getUsers, Register } from "../controllers/UsersControllers.js";

const router = express.Router();

router.get("/users", getUsers);
router.post("/users", Register);

export default router;

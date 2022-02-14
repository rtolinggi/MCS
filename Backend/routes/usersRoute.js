import express from "express";
import { getUsers } from "../controllers/UsersControllers";

const router = express.Router();

router.get("/users", getUsers);

export default router;
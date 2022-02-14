import express from "express";
import db from "./config/database.js";
import UserModel from "./models/UserModel.js";
import router from "./routes/UserRoute.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

try {
  await db.authenticate();
  console.log("Database Connected..");
  await UserModel.sync();
} catch (errors) {
  console.log(errors);
}

app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`server running at port ${PORT}`));

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";
import User from "./models/user.model.js";

dotenv.config(); //stores .env file values in process variable
const app = express();

app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "https://linkora-1-hnpz.onrender.com",
    credentials: true,
  }),
); //preventing from cors issue

app.use(express.json()); //parsing json data from incoming request and making it available in req.body

app.use(express.static(path.join(__dirname, "/uploads")));

const start = async () => {
  const connectDB = await mongoose.connect(process.env.MONGO_URL);

  app.listen(8080, () => {
    console.log("server running on port 8080");
  });
};

start();

app.use(postRoutes);
app.use(userRoutes);
app.get("/check-auth", async (req, res) => {
  let token = req.cookies?.token;
  if (!token) {
    return res.json({
      userPresent: false,
    });
  }
  const user = await User.findOne({ token });

  if (!user) {
    return res.json({
      userPresent: false,
    });
  } else {
    return res.json({
      userPresent: true,
    });
  }
});

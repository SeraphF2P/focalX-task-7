import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/authRouter.ts";
import courseRouter from "./routes/courseRouter.ts";
import videoRouter from "./routes/videoRouter.ts";
import commentRouter from "./routes/commentRouter.ts";
const app = express();
const PORT = process.env.PORT;
dotenv.config();
mongoose
  .connect("mongodb://localhost:27017/course-platform")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/course", courseRouter);
app.use("/api/video", videoRouter);
app.use("/api/comment", commentRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

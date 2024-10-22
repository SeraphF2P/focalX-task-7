import {
  createVideo,
  editVideo,
  getAllVideoForACourse,
  getAllVideos,
  readVideo,
  removeVideo,
} from "@/controllers/videoController";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { checkAutheraizedUserForCourse } from "@/middlewares/checkAutheraizedUserForCourse";
import { checkAutheraizedUserForVideo } from "@/middlewares/checkAutheraizedUserForVideo";
import express from "express";

const router = express.Router();

router.get("/", authMiddleware, getAllVideos);
router.get("/:video_id", authMiddleware, readVideo);
router.delete("/:video_id", checkAutheraizedUserForVideo, removeVideo);
router.post("/:course_id", checkAutheraizedUserForCourse, createVideo);
router.put("/:video_id", checkAutheraizedUserForVideo, editVideo);

router.get("/course/:course_id", authMiddleware, getAllVideoForACourse);
export default router;

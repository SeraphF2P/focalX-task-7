import {
  createComment,
  editComment,
  getAllCommentForAVideo,
  getAllComments,
  readComment,
  removeComment,
} from "@/controllers/commentController";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { checkAutheraizedUserForComment } from "@/middlewares/checkAutheraizedUserForComment";
import { checkAutheraizedUserForVideo } from "@/middlewares/checkAutheraizedUserForVideo";
import express from "express";

const router = express.Router();

router.get("/", authMiddleware, getAllComments);
router.get("/:comment_id", authMiddleware, readComment);
router.delete("/:comment_id", checkAutheraizedUserForComment, removeComment);
router.post("/:video_id", checkAutheraizedUserForVideo, createComment);
router.put("/:comment_id", checkAutheraizedUserForComment, editComment);

router.get("/video/:video_id", authMiddleware, getAllCommentForAVideo);
export default router;

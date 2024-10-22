import { authMiddleware } from "@/middlewares/authMiddleware";
import { checkAutheraizedUserForCourse } from "@/middlewares/checkAutheraizedUserForCourse";
import express from "express";
import {
  createCourse,
  editCourse,
  getAllCourse,
  readCourse,
  removeCourse,
} from "../controllers/courseController";

const router = express.Router();

router.get("/", authMiddleware, getAllCourse);
router.get("/:course_id", authMiddleware, readCourse);
router.post("/", authMiddleware, createCourse);
router.put("/:course_id", checkAutheraizedUserForCourse, editCourse);
router.delete("/:course_id", checkAutheraizedUserForCourse, removeCourse);

export default router;

import { Course } from "@/models/Course";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { User } from "../models/User";

export const checkAutheraizedUserForCourse = async (
  req: Request & { user?: unknown; course?: unknown },
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const course_id = req.params.course_id;
    const course = await Course.findById(course_id);
    if (course == null) {
      res.status(404).json({ message: "course not found" });
    } else if (!token) {
      res.status(401).json({ msg: "No token, authorization denied" });
    } else if (token) {
      const decoded = verifyToken(token) as { id: string };
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(404).json({ msg: "User not found" });
      } else if (course?.checkAuthUser(user?.id)) {
        req.user = user;
        req.course = course;
        next();
      } else {
        res
          .status(401)
          .json({ message: "you don't have permission to this action" });
      }
    }
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

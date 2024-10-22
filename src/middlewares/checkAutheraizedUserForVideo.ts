import { Video } from "@/models/Video";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { User } from "../models/User";

export const checkAutheraizedUserForVideo = async (
  req: Request & { user?: unknown; video?: unknown },
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const video_id = req.params.video_id;
    const video = await Video.findById(video_id);
    if (video == null) {
      res.status(404).json({ message: "video not found" });
    } else if (!token) {
      res.status(401).json({ msg: "No token, authorization denied" });
    } else if (token) {
      const decoded = verifyToken(token) as { id: string };
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(404).json({ msg: "User not found" });
      } else if (video?.checkAuthUser(user?.id)) {
        req.user = user;
        req.video = video;
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

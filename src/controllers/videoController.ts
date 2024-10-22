import { Request, RequestHandler, Response } from "express";
import { validateSchemas } from "../lib/zod";
import { Video, VideoType } from "../models/Video";
import { UserType } from "../models/User";
import { Course } from "@/models/Course";

export const createVideo = async (
  req: Request<{ course_id: string }> & { user?: UserType & { _id: string } },
  res: Response
) => {
  try {
    const { success, data, error } =
      await validateSchemas.createVideo.safeParseAsync(req.body);
    if (!success) {
      res.status(400).json({ message: error.errors[0].message });
    }
    if (success) {
      const user = req.user;
      const course = await Course.findById(req.params.course_id);
      if (course) {
        const video = await Video.create({
          user_id: user?._id,
          course_id: req.params.course_id,
          ...data,
        });
        course.videos.push(video._id);
        await course.save();
        res.status(200).json({ message: "video created successfully", video });
      } else {
        res.status(404).json({ message: "video not found" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const editVideo = async (
  req: Request & {
    user?: UserType & { _id: string };
    video?: VideoType & { _id: string };
  },
  res: Response
) => {
  try {
    const { success, data, error } =
      await validateSchemas.editVideo.safeParseAsync(req.body);
    if (!success) {
      res.status(400).json({ message: error.errors[0].message });
    }
    if (success) {
      const user = req.user;
      const video_id = req.params.video_id;
      const video = await Video.findById(video_id);
      const { acknowledged } = await video?.updateOne({
        _id: video_id,
        user_id: user?._id,
        ...data,
      });
      if (acknowledged) {
        res.status(200).json({ message: "video edited successfully" });
      } else {
        res
          .status(500)
          .json({ message: "something went wrong try again later" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const removeVideo = async (
  req: Request & { video?: VideoType & { _id: string } },
  res: Response
) => {
  try {
    const { acknowledged } = await Video.deleteOne({
      _id: req.video?._id,
    });
    if (acknowledged) {
      res.status(200).json({ message: "video delete successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const readVideo: RequestHandler<
  { video_id: string },
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  try {
    const video = await Video.findById(req.params.video_id);
    if (video) {
      res.status(200).json(video);
    } else {
      res.status(404).json({ message: "video not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const getAllVideos: RequestHandler = async (req, res) => {
  try {
    const videos = await Video.find().limit(100);
    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getAllVideoForACourse: RequestHandler<
  { course_id: string },
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  try {
    const course = await Course.findById(req.params.course_id)
      .select("videos")
      .populate("videos");
    if (course) {
      res.status(200).json(course?.videos);
    } else {
      res.status(404).json({ message: "courese not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

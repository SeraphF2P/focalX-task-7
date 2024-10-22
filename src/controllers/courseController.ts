import { Request, RequestHandler, Response } from "express";
import { validateSchemas } from "../lib/zod";
import { Course } from "../models/Course";
import { User, UserType } from "../models/User";

export const createCourse = async (
  req: Request & { user?: UserType & { _id: string } },
  res: Response
) => {
  try {
    const { success, data, error } =
      await validateSchemas.createCourse.safeParseAsync(req.body);

    if (!success) {
      res.status(400).json({ message: error.errors[0].message });
    }

    const course = await Course.create({ user_id: req.user?._id, ...data });

    const user = await User.findById(req.user?._id);
    if (user) {
      user.courses.push(course._id);
      await user.save();
      res.status(200).json({ message: "Course created successfully", course });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editCourse = async (
  req: Request<{ course_id: string }, unknown, unknown, unknown> & {
    user?: UserType & { _id: string };
  },
  res: Response
) => {
  try {
    const { success, data, error } =
      await validateSchemas.editCourse.safeParseAsync(req.body);
    if (!success) {
      res.status(400).json({ message: error.errors[0].message });
    } else if (success) {
      const user = req.user;
      const course = await Course.findById(req.params.course_id);
      if (course) {
        const { acknowledged } = await course?.updateOne({
          user_id: user?._id,
          ...data,
        });
        if (acknowledged) {
          res.status(200).json({ message: "course edited successfully" });
        } else {
          res
            .status(500)
            .json({ message: "something went wrong try again later" });
        }
      } else {
        res.status(404).json({ message: "course not found" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const removeCourse: RequestHandler<
  { course_id: string },
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.params.course_id });
    res.status(200).json({ message: "course delete successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const readCourse: RequestHandler<
  { course_id: string },
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  try {
    const course = await Course.findById(req.params.course_id).populate(
      "videos"
    );

    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: "course not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const getAllCourse: RequestHandler = async (req, res) => {
  try {
    const course = await Course.find().limit(100);
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

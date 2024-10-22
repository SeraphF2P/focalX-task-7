import { Request, RequestHandler, Response } from "express";
import { validateSchemas } from "../lib/zod";
import { Comment, CommentType } from "../models/Comment";
import { UserType } from "../models/User";
import { Video } from "@/models/Video";

export const createComment = async (
  req: Request<{ video_id: string }> & { user?: UserType & { _id: string } },
  res: Response
) => {
  try {
    const { success, data, error } =
      await validateSchemas.createComment.safeParseAsync(req.body);
    if (!success) {
      res.status(400).json({ message: error.errors[0].message });
    }
    if (success) {
      const user = req.user;
      const video = await Video.findById(req.params.video_id);
      if (video) {
        const comment = await Comment.create({
          user_id: user?._id,
          video_id: req.params.video_id,
          ...data,
        });
        video.comments.push(comment._id);
        await video.save();
        res
          .status(200)
          .json({ message: "comment created successfully", comment });
      } else {
        res.status(404).json({ message: "comment not found" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const editComment = async (
  req: Request & {
    user?: UserType & { _id: string };
    comment?: CommentType & { _id: string };
  },
  res: Response
) => {
  try {
    const { success, data, error } =
      await validateSchemas.editComment.safeParseAsync(req.body);
    if (!success) {
      res.status(400).json({ message: error.errors[0].message });
    }
    if (success) {
      const user = req.user;
      const comment_id = req.params.comment_id;
      const comment = await Comment.findById(comment_id);
      const { acknowledged } = await comment?.updateOne({
        _id: comment_id,
        user_id: user?._id,
        ...data,
      });
      if (acknowledged) {
        res.status(200).json({ message: "comment edited successfully" });
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

export const removeComment = async (
  req: Request & { comment?: CommentType & { _id: string } },
  res: Response
) => {
  try {
    const { acknowledged } = await Comment.deleteOne({
      _id: req.comment?._id,
    });
    if (acknowledged) {
      res.status(200).json({ message: "comment delete successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const readComment: RequestHandler<
  { comment_id: string },
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.comment_id);
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({ message: "comment not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const getAllComments: RequestHandler = async (req, res) => {
  try {
    const comments = await Comment.find().limit(100);
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getAllCommentForAVideo: RequestHandler<
  { video_id: string },
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  try {
    const video = await Video.findById(req.params.video_id)
      .select("comments")
      .populate("comments");
    if (video) {
      res.status(200).json(video?.comments);
    } else {
      res.status(404).json({ message: "video not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

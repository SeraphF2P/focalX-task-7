import { InferSchemaType, model, Schema } from "mongoose";

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course_id: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export type VideoType = InferSchemaType<typeof videoSchema> & {
  checkAuthUser: (user_id: string) => boolean;
};
function checkAuthUser(this: VideoType, user_id: string) {
  return this.user_id?.toString() === user_id;
}
videoSchema.methods.checkAuthUser = checkAuthUser;
export const Video = model<VideoType>("Video", videoSchema);

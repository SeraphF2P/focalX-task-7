import { InferSchemaType, model, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video_id: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  { timestamps: true }
);

export type CommentType = InferSchemaType<typeof commentSchema> & {
  checkAuthUser: (user_id: string) => boolean;
};
function checkAuthUser(this: CommentType, user_id: string) {
  return this.user_id?.toString() === user_id;
}
commentSchema.methods.checkAuthUser = checkAuthUser;
export const Comment = model<CommentType>("Comment", commentSchema);

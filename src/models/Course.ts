import { InferSchemaType, model, Schema } from "mongoose";

const courseSchema = new Schema(
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
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export type CourseType = InferSchemaType<typeof courseSchema> & {
  checkAuthUser: (user_id: string) => boolean;
};
function checkAuthUser(this: CourseType, user_id: string) {
  return this.user_id?.toString() === user_id;
}
courseSchema.methods.checkAuthUser = checkAuthUser;
export const Course = model<CourseType>("Course", courseSchema);

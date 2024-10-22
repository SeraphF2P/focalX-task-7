import bcrypt from "bcrypt";
import { InferSchemaType, model, Schema } from "mongoose";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
export type UserType = InferSchemaType<typeof userSchema>;

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 8);
  next();
});
async function comparePassword(this: UserType, enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.methods.comparePassword = comparePassword;
export const User = model<
  UserType & { comparePassword: typeof comparePassword }
>("User", userSchema);

import z from "zod";
const userNameZodSchema = z
  .string({ invalid_type_error: "user name must be a string" })
  .min(3, "user name cannot be less then 3 charecter ")
  .max(24, "user name cannot be more then 24 charecter ");
const passwordZodSchema = (name = "password") =>
  z
    .string({
      invalid_type_error: `${name} must be a string`,
      required_error: `${name} is required`,
    })
    .min(8, `${name} cannot be less then 8 charecter `)
    .max(24, `${name} cannot be more then 24 charecter `)
    .refine((value) => {
      return /(?=.*[A-Z])(?=.*\d)/.test(value);
    }, `${name} must have at least one capital and one number`);

export const validateSchemas = {
  signup: z
    .object({
      userName: userNameZodSchema,
      password: passwordZodSchema(),
      password_confirmation: passwordZodSchema("password confirmation"),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Passwords don't match",
      path: ["password_confirmation"],
    }),
  login: z.object({
    userName: userNameZodSchema,
    password: passwordZodSchema(),
  }),
  createCourse: z.object({
    title: z
      .string({ required_error: "title is required" })
      .min(8, "title cannot be less then 8 charecter ")
      .max(32, "title cannot be more then 32 charecter "),
    description: z
      .string({ required_error: "description is required" })
      .min(64, "description cannot be less then 64 charecter ")
      .max(256, "description cannot be more then 256 charecter "),
    duration: z
      .string({ required_error: "duration is required" })
      .min(3, "duration cannot be less then 3 charecter ")
      .max(32, "duration cannot be more then 32 charecter"),
  }),
  editCourse: z.object({
    title: z
      .string({ required_error: "title is required" })
      .min(8, "title cannot be less then 8 charecter ")
      .max(32, "title cannot be more then 32 charecter "),
    description: z
      .string({ required_error: "description is required" })
      .min(64, "description cannot be less then 64 charecter ")
      .max(256, "description cannot be more then 256 charecter "),
    duration: z
      .string({ required_error: "duration is required" })
      .min(3, "duration cannot be less then 3 charecter ")
      .max(32, "duration cannot be more then 32 charecter"),
  }),
  createVideo: z.object({
    title: z
      .string({ required_error: "title is required" })
      .min(8, "title cannot be less then 8 charecter ")
      .max(32, "title cannot be more then 32 charecter "),
    description: z
      .string({ required_error: "description is required" })
      .min(64, "description cannot be less then 64 charecter ")
      .max(256, "description cannot be more then 256 charecter "),
    duration: z.string({ required_error: "duration is required" }).refine(
      (value) => {
        return /^([0-9]{1,2}|[0-9]{1,2}):([0-5]\d):([0-5]\d)$/.test(value);
      },
      {
        message: "duration must be of hh:mm:ss date format",
        path: ["duration"],
      }
    ),
  }),
  editVideo: z.object({
    title: z
      .string({ required_error: "title is required" })
      .min(8, "title cannot be less then 8 charecter ")
      .max(32, "title cannot be more then 32 charecter "),
    description: z
      .string({ required_error: "description is required" })
      .min(64, "description cannot be less then 64 charecter ")
      .max(256, "description cannot be more then 256 charecter "),
    duration: z.string({ required_error: "duration is required" }).refine(
      (value) => {
        return /^([0-9]{1,2}|[0-9]{1,2}):([0-5]\d):([0-5]\d)$/.test(value);
      },
      {
        message: "duration must be of hh:mm:ss date format",
        path: ["duration"],
      }
    ),
  }),
  createComment: z.object({
    text: z
      .string({ required_error: "text is required" })
      .min(1, "text can't be empty")
      .max(255, "text can't exceed 255 charecter"),
  }),
  editComment: z.object({
    text: z
      .string({ required_error: "text is required" })
      .min(1, "text can't be empty")
      .max(255, "text can't exceed 255 charecter"),
  }),
};

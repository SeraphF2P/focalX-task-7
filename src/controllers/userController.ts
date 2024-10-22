import { RequestHandler } from "express";
import { createToken } from "../lib/jwt";
import { validateSchemas } from "../lib/zod";
import { User } from "../models/User";

export const register: RequestHandler = async (req, res) => {
  try {
    const { success, error, data } =
      await validateSchemas.signup.safeParseAsync(req.body);

    if (error) {
      res.status(400).json(error.errors[0].message);
    }
    if (success) {
      const existedUser = await User.findOne({ userName: data.userName });
      if (existedUser) {
        res.status(400).json({ message: "User already exists" });
      } else {
        const user = await User.create(data);
        const token = createToken({
          id: user._id,
          userName: user.userName,
        });
        res.status(200).json({
          message: "signed up successfully",
          token,
          user: { id: user._id, UserName: user.userName },
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong try again later" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { success, error, data } = await validateSchemas.login.safeParseAsync(
      req.body
    );

    if (error) {
      res.status(400).json(error.errors[0].message);
    }
    if (success) {
      const user = await User.findOne({ userName: data.userName });
      if (!user) {
        res.status(404).json({ message: "User doesn't exists" });
      } else {
        const isAuth = await user.comparePassword(data.password);
        if (isAuth) {
          const token = createToken({
            id: user._id,
            userName: user.userName,
          });
          res.status(200).json({
            message: "login up successfully",
            token,
            user: { id: user._id, UserName: user.userName },
          });
        } else {
          res.status(401).json({
            message: "invalid user name or passowrd",
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong try again later" });
  }
};

import { Request, Response } from "express";
import { authSchema } from "../types";
import { client } from "../client";
import jwt from "jsonwebtoken";

export const Signup = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const result = authSchema.safeParse(body);
    if (!result.success)
      return res.status(401).json({
        type: "show-error",
        errors: result.error,
      });
    const isUser = await client.user.findFirst({
      where: { email: result.data.email },
    });
    if (isUser)
      return res.status(401).json({
        type: "toast-error",
        message: "User already exist",
      });
    const user = await client.user.create({ data: body });
    const token = jwt.sign({ Id: user.Id }, process.env.JWT_PASSWORD!);
    res.cookie("authToken", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(201).json({
      message: "user created successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      type: "toast-error",
      message: "Internal server error",
    });
  }
};

export const Signin = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const result = authSchema.safeParse(body);
    if (!result.success)
      return res.status(401).json({
        type: "show-error",
        errors: result.error,
      });
    const isUser = await client.user.findFirst({
      where: { email: result.data.email },
    });
    if (isUser) {
      if (isUser.password == result.data.password) {
        const token = jwt.sign({ Id: isUser.Id }, process.env.JWT_PASSWORD!);
        res.cookie("authToken", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        return res.status(201).json({
          message: "Logged in succesfully",
        });
      }
    }
    return res.status(401).json({
      type: "toast-error",
      message: "email or password is wrong",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      type: "toast-error",
      message: "Internal server error",
    });
  }
};

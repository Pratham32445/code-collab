import { Router } from "express";
import { Signin, Signup } from "../controllers/User.controller";

export const userRouter = Router();

// @ts-ignore
userRouter.post("/signup", Signup);

// @ts-ignore
userRouter.post("/login", Signin);

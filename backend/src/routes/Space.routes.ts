import { Router } from "express";
import { createSpace } from "../controllers/Space.controller";
import { userMiddleware } from "../middlewares/user";

const spaceRouter = Router();

//@ts-ignore
spaceRouter.post("/create-space",userMiddleware, createSpace);

export default spaceRouter;

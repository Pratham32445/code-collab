import express from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/User.routes";
import spaceRouter from "./routes/Space.routes";
import { copyFolder } from "./r2";

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/api/v1/user",userRouter);

app.use("/api/v1/space",spaceRouter);

app.listen(3001);

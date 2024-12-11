import express from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/User.routes";

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/app/v1/user",userRouter);

app.listen(3001);

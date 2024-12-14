import express from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/User.routes";
import spaceRouter from "./routes/Space.routes";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/api/v1/user", userRouter);

app.use("/api/v1/space", spaceRouter);

app.listen(3001);

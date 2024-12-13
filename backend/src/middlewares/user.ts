import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { decode } from "punycode";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_PASSWORD!) as {
      Id: string;
    };
    // @ts-ignore
    req.userId = decoded.Id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

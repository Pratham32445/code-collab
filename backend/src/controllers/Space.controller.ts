import { Request, Response } from "express";
import { spaceSchema } from "../types";
import { client } from "../client";
import { copyFolder } from "../r2";
import { v4 as uuidv4 } from "uuid";

export const createSpace = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    // @ts-ignore
    body.adminId = req.userId;
    const results = spaceSchema.safeParse(body);
    if (!results.success)
      return res.status(401).json({
        type: "show-errors",
        errors: results.error,
      });
    const Id = uuidv4();
    if (await copyFolder(req.body.template, Id)) {
      const space = await client.space.create({ data: { ...body, Id } });
      return res.status(201).json({
        message: "Created",
      });
    }
    res.status(401).json({
      message: "some error occured while creating project",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      type: "toast-error",
      message: "Internal server error",
    });
  }
};

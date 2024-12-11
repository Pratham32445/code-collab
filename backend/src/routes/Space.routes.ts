import { Router } from "express";
import { createSpace } from "../controllers/Space.controller";

const router = Router();

router.post("/create-space", createSpace);

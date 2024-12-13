import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "password should be greater than 6 length"),
});

export const spaceSchema = z.object({
  spaceName: z.string(),
  adminId: z.string(),
  thumbnail: z.string(),
  template : z.string()
});

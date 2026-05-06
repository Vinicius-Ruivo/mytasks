import { z } from "zod";

export const updateNicknameSchema = z.object({
  nickname: z.string().trim().min(2).max(30),
});

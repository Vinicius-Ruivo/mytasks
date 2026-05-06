import { z } from "zod";

export const todoStatusSchema = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);

export const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  isExtraMile: z.boolean().default(false),
});

export const updateTodoSchema = z.object({
  id: z.string().cuid(),
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).optional().nullable(),
  status: todoStatusSchema.optional(),
  isExtraMile: z.boolean().optional(),
});

export const deleteTodoSchema = z.object({
  id: z.string().cuid(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

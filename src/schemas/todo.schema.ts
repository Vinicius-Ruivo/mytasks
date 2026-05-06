import { z } from "zod";

export const todoStatusSchema = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);

export const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  isExtraMile: z.boolean().default(false),
  blockId: z.string().cuid().optional().nullable(),
});

export const updateTodoSchema = z.object({
  id: z.string().cuid(),
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).optional().nullable(),
  status: todoStatusSchema.optional(),
  isExtraMile: z.boolean().optional(),
  blockId: z.string().cuid().optional().nullable(),
});

export const deleteTodoSchema = z.object({
  id: z.string().cuid(),
});

export const createBlockSchema = z.object({
  name: z.string().trim().min(1).max(40),
  color: z.string().trim().max(20).optional().nullable(),
});

export const createTodoNoteSchema = z.object({
  todoId: z.string().cuid(),
  content: z.string().trim().min(1).max(1200),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

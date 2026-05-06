import { z } from "zod";

export const todoStatusSchema = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);
export const todoPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  isExtraMile: z.boolean().default(false),
  blockId: z.string().cuid().optional().nullable(),
  priority: todoPrioritySchema.default("MEDIUM"),
  dueDate: z.string().datetime().optional().nullable(),
});

export const updateTodoSchema = z.object({
  id: z.string().cuid(),
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).optional().nullable(),
  status: todoStatusSchema.optional(),
  isExtraMile: z.boolean().optional(),
  blockId: z.string().cuid().optional().nullable(),
  priority: todoPrioritySchema.optional(),
  dueDate: z.string().datetime().optional().nullable(),
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

export const createSubtaskSchema = z.object({
  parentId: z.string().cuid(),
  title: z.string().trim().min(1).max(120),
});

export const createChecklistItemSchema = z.object({
  todoId: z.string().cuid(),
  content: z.string().trim().min(1).max(200),
});

export const toggleChecklistItemSchema = z.object({
  id: z.string().cuid(),
  done: z.boolean(),
});

export const createTemplateSchema = z.object({
  name: z.string().trim().min(1).max(40),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  priority: todoPrioritySchema.default("MEDIUM"),
  subtasks: z.array(z.string().trim().min(1).max(120)).max(30).optional().default([]),
  checklist: z.array(z.string().trim().min(1).max(200)).max(40).optional().default([]),
});

export const createFromTemplateSchema = z.object({
  templateId: z.string().cuid(),
  blockId: z.string().cuid().optional().nullable(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

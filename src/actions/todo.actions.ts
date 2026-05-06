"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { sanitizeText } from "@/lib/security";
import {
  createChecklistItemSchema,
  createBlockSchema,
  createFromTemplateSchema,
  createSubtaskSchema,
  createTemplateSchema,
  createTodoNoteSchema,
  createTodoSchema,
  deleteTodoSchema,
  toggleChecklistItemSchema,
  updateTodoSchema,
  type CreateTodoInput,
  type UpdateTodoInput,
} from "@/schemas/todo.schema";

async function requireUserId() {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export async function createTodo(input: CreateTodoInput) {
  const userId = await requireUserId();
  const parsed = createTodoSchema.parse(input);

  await prisma.todo.create({
    data: {
      title: sanitizeText(parsed.title),
      description: parsed.description ? sanitizeText(parsed.description) : null,
      isExtraMile: parsed.isExtraMile,
      blockId: parsed.blockId ?? null,
      priority: parsed.priority,
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
      userId,
    },
  });

  revalidatePath("/dashboard");
}

export async function createSubtask(input: { parentId: string; title: string }) {
  const userId = await requireUserId();
  const parsed = createSubtaskSchema.parse(input);

  const parent = await prisma.todo.findUnique({
    where: { id: parsed.parentId },
    select: { userId: true, blockId: true },
  });
  if (!parent || parent.userId !== userId) throw new Error("Forbidden");

  await prisma.todo.create({
    data: {
      title: sanitizeText(parsed.title),
      userId,
      parentId: parsed.parentId,
      blockId: parent.blockId,
    },
  });
  revalidatePath("/dashboard");
}

export async function updateTodo(input: UpdateTodoInput) {
  const userId = await requireUserId();
  const parsed = updateTodoSchema.parse(input);

  const todo = await prisma.todo.findUnique({
    where: { id: parsed.id },
    select: { userId: true },
  });

  if (!todo || todo.userId !== userId) {
    throw new Error("Forbidden");
  }

  await prisma.todo.updateMany({
    where: { id: parsed.id, userId },
    data: {
      title: parsed.title ? sanitizeText(parsed.title) : undefined,
      description:
        parsed.description !== undefined
          ? parsed.description
            ? sanitizeText(parsed.description)
            : null
          : undefined,
      status: parsed.status,
      isExtraMile: parsed.isExtraMile,
      blockId: parsed.blockId ?? undefined,
      priority: parsed.priority,
      dueDate: parsed.dueDate !== undefined ? (parsed.dueDate ? new Date(parsed.dueDate) : null) : undefined,
    },
  });

  revalidatePath("/dashboard");
}

export async function createLifeBlock(input: { name: string; color?: string | null }) {
  const userId = await requireUserId();
  const parsed = createBlockSchema.parse(input);

  await prisma.lifeBlock.create({
    data: {
      name: sanitizeText(parsed.name),
      color: parsed.color ? sanitizeText(parsed.color) : null,
      userId,
    },
  });

  revalidatePath("/dashboard");
}

export async function createTodoNote(input: { todoId: string; content: string }) {
  const userId = await requireUserId();
  const parsed = createTodoNoteSchema.parse(input);

  const todo = await prisma.todo.findUnique({
    where: { id: parsed.todoId },
    select: { userId: true },
  });

  if (!todo || todo.userId !== userId) {
    throw new Error("Forbidden");
  }

  await prisma.todoNote.create({
    data: {
      todoId: parsed.todoId,
      userId,
      content: sanitizeText(parsed.content),
    },
  });

  revalidatePath("/dashboard");
}

export async function createChecklistItem(input: { todoId: string; content: string }) {
  const userId = await requireUserId();
  const parsed = createChecklistItemSchema.parse(input);
  const todo = await prisma.todo.findUnique({ where: { id: parsed.todoId }, select: { userId: true } });
  if (!todo || todo.userId !== userId) throw new Error("Forbidden");

  await prisma.todoChecklistItem.create({
    data: { todoId: parsed.todoId, userId, content: sanitizeText(parsed.content) },
  });
  revalidatePath("/dashboard");
}

export async function toggleChecklistItem(input: { id: string; done: boolean }) {
  const userId = await requireUserId();
  const parsed = toggleChecklistItemSchema.parse(input);
  await prisma.todoChecklistItem.updateMany({
    where: { id: parsed.id, userId },
    data: { done: parsed.done },
  });
  revalidatePath("/dashboard");
}

export async function createTemplate(input: {
  name: string;
  title: string;
  description?: string | null;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  subtasks?: string[];
  checklist?: string[];
}) {
  const userId = await requireUserId();
  const parsed = createTemplateSchema.parse(input);
  const sanitizedSubtasks = parsed.subtasks.map((item) => sanitizeText(item)).filter(Boolean);
  const sanitizedChecklist = parsed.checklist.map((item) => sanitizeText(item)).filter(Boolean);

  await prisma.taskTemplate.create({
    data: {
      userId,
      name: sanitizeText(parsed.name),
      title: sanitizeText(parsed.title),
      description: parsed.description ? sanitizeText(parsed.description) : null,
      priority: parsed.priority,
      subtasks: {
        create: sanitizedSubtasks.map((content, index) => ({ content, sortOrder: index })),
      },
      checklist: {
        create: sanitizedChecklist.map((content, index) => ({ content, sortOrder: index })),
      },
    },
  });
  revalidatePath("/dashboard");
}

export async function createTodoFromTemplate(input: { templateId: string; blockId?: string | null }) {
  const userId = await requireUserId();
  const parsed = createFromTemplateSchema.parse(input);
  const template = await prisma.taskTemplate.findUnique({
    where: { id: parsed.templateId },
    select: {
      userId: true,
      title: true,
      description: true,
      priority: true,
      subtasks: { orderBy: { sortOrder: "asc" }, select: { content: true } },
      checklist: { orderBy: { sortOrder: "asc" }, select: { content: true } },
    },
  });
  if (!template || template.userId !== userId) throw new Error("Forbidden");

  await prisma.todo.create({
    data: {
      userId,
      title: template.title,
      description: template.description,
      priority: template.priority,
      blockId: parsed.blockId ?? null,
      subtasks: {
        create: template.subtasks.map((subtask) => ({
          title: subtask.content,
          userId,
          blockId: parsed.blockId ?? null,
        })),
      },
      checklist: {
        create: template.checklist.map((item) => ({
          content: item.content,
          userId,
        })),
      },
    },
  });
  revalidatePath("/dashboard");
}

export async function deleteTodo(input: { id: string }) {
  const userId = await requireUserId();
  const parsed = deleteTodoSchema.parse(input);

  await prisma.todo.deleteMany({
    where: { id: parsed.id, userId },
  });

  revalidatePath("/dashboard");
}

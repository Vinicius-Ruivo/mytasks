"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { sanitizeText } from "@/lib/security";
import {
  createBlockSchema,
  createTodoNoteSchema,
  createTodoSchema,
  deleteTodoSchema,
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

export async function deleteTodo(input: { id: string }) {
  const userId = await requireUserId();
  const parsed = deleteTodoSchema.parse(input);

  await prisma.todo.deleteMany({
    where: { id: parsed.id, userId },
  });

  revalidatePath("/dashboard");
}

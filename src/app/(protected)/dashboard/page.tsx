import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TodoForm } from "@/components/todo/todo-form";
import { TodoList } from "@/components/todo/todo-list";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      isExtraMile: true,
      block: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const blocks = await prisma.lifeBlock.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{session.user.email}</p>
        </div>
        <LogoutButton />
      </header>
      <TodoForm blocks={blocks} />
      <TodoList todos={todos} blocks={blocks} />
    </main>
  );
}

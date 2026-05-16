import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TodoForm } from "@/components/todo/todo-form";
import { TodoList } from "@/components/todo/todo-list";
import { Card } from "@/components/ui/card";
import { FocusMap } from "@/components/dashboard/focus-map";
import { NicknameOnboarding } from "@/components/dashboard/nickname-onboarding";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardMobileControls } from "@/components/dashboard/dashboard-mobile-controls";

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id, parentId: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
      isExtraMile: true,
      block: {
        select: {
          id: true,
          name: true,
        },
      },
      notes: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
      subtasks: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
      checklist: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          content: true,
          done: true,
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

  const userProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      nickname: true,
      name: true,
      email: true,
    },
  });

  const templates = await prisma.taskTemplate.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });

  const metrics = {
    total: todos.length,
    pending: todos.filter((todo) => todo.status === "PENDING").length,
    inProgress: todos.filter((todo) => todo.status === "IN_PROGRESS").length,
    completed: todos.filter((todo) => todo.status === "COMPLETED").length,
    extraMile: todos.filter((todo) => todo.isExtraMile).length,
  };

  const focusMapItems = blocks
    .map((block) => {
      const blockTodos = todos.filter((todo) => todo.block?.id === block.id);
      return {
        blockId: block.id,
        blockName: block.name,
        total: blockTodos.length,
        completed: blockTodos.filter((todo) => todo.status === "COMPLETED").length,
      };
    })
    .sort((a, b) => b.completed - a.completed || b.total - a.total);

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <DashboardSidebar
        displayName={userProfile?.nickname ?? userProfile?.name ?? "Usuario"}
        email={userProfile?.email ?? session.user.email ?? "sem-email"}
      />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col gap-4 p-3 sm:p-4 md:p-6 xl:p-8">
        <DashboardMobileControls
          displayName={userProfile?.nickname ?? userProfile?.name ?? "Usuario"}
          email={userProfile?.email ?? session.user.email ?? "sem-email"}
        />
        <DashboardHero metrics={metrics} />

        {!userProfile?.nickname ? <NicknameOnboarding /> : null}

        <FocusMap items={focusMapItems} />

        <section className="grid gap-4 md:grid-cols-[1.2fr_2fr]">
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Criacao rapida</h2>
            <TodoForm blocks={blocks} templates={templates} />
          </Card>

          <Card>
            <TodoList todos={todos} blocks={blocks} />
          </Card>
        </section>
      </main>
    </div>
  );
}

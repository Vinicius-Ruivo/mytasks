import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TodoForm } from "@/components/todo/todo-form";
import { TodoList } from "@/components/todo/todo-list";
import { LogoutButton } from "@/components/auth/logout-button";
import { Card } from "@/components/ui/card";
import { FocusMap } from "@/components/dashboard/focus-map";
import { NicknameOnboarding } from "@/components/dashboard/nickname-onboarding";

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

  const userProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      nickname: true,
      name: true,
      email: true,
    },
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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
      <header className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">MyTasks Dashboard</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Visao geral da sua rotina -{" "}
            {userProfile?.nickname ?? userProfile?.name ?? userProfile?.email ?? session.user.email}
          </p>
        </div>
        <LogoutButton />
      </header>

      {!userProfile?.nickname ? <NicknameOnboarding /> : null}

      <section className="grid gap-3 md:grid-cols-5">
        <Card className="border-l-4 border-l-indigo-500">
          <p className="text-xs uppercase text-zinc-500">Total</p>
          <p className="text-2xl font-bold">{metrics.total}</p>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <p className="text-xs uppercase text-zinc-500">Pendentes</p>
          <p className="text-2xl font-bold">{metrics.pending}</p>
        </Card>
        <Card className="border-l-4 border-l-sky-500">
          <p className="text-xs uppercase text-zinc-500">Em progresso</p>
          <p className="text-2xl font-bold">{metrics.inProgress}</p>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <p className="text-xs uppercase text-zinc-500">Concluidas</p>
          <p className="text-2xl font-bold">{metrics.completed}</p>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <p className="text-xs uppercase text-zinc-500">Extra mile</p>
          <p className="text-2xl font-bold">{metrics.extraMile}</p>
        </Card>
      </section>

      <FocusMap items={focusMapItems} />

      <section className="grid gap-4 md:grid-cols-[1.2fr_2fr]">
        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Criacao rapida</h2>
          <TodoForm blocks={blocks} />
        </Card>

        <Card>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium dark:bg-zinc-800">
              Blocos: {blocks.length}
            </span>
            {blocks.map((block) => (
              <span
                key={block.id}
                className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium dark:border-zinc-700"
              >
                {block.name}
              </span>
            ))}
          </div>
          <TodoList todos={todos} blocks={blocks} />
        </Card>
      </section>
    </main>
  );
}

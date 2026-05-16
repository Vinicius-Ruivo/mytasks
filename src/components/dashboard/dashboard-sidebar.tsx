"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { InstallAppButton } from "@/components/dashboard/install-app-button";

type Props = {
  displayName: string;
  email: string;
};

export function DashboardSidebar({ displayName, email }: Props) {
  const [openSettings, setOpenSettings] = useState(false);
  const { setTheme, theme } = useTheme();

  return (
    <aside className="sticky top-0 hidden h-screen w-[min(100%,270px)] shrink-0 flex-col justify-between border-r border-zinc-200 bg-white/80 p-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 md:flex">
      <div className="space-y-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs uppercase text-zinc-500">Workspace</p>
          <p className="mt-1 text-lg font-semibold">MyTasks</p>
        </div>

        <Button variant="secondary" className="w-full justify-start gap-2">
          <LayoutDashboard className="size-4" />
          Dashboard
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => setOpenSettings((prev) => !prev)}
        >
          <Settings className="size-4" />
          Configuracoes
        </Button>

        <AnimatePresence>
          {openSettings ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-zinc-500">{email}</p>

              <div className="mt-3 space-y-2">
                <p className="text-xs uppercase text-zinc-500">Tema</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="size-4" />
                    Claro
                  </Button>
                  <Button
                    size="sm"
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="size-4" />
                    Escuro
                  </Button>
                </div>
              </div>

              <div className="mt-3">
                <p className="mb-2 text-xs uppercase text-zinc-500">Aplicativo</p>
                <InstallAppButton />
              </div>

              <div className="mt-3">
                <LogoutButton />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <p className="text-xs text-zinc-500">Planeje melhor. Entregue melhor.</p>
    </aside>
  );
}

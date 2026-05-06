"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { InstallAppButton } from "@/components/dashboard/install-app-button";
import { LogoutButton } from "@/components/auth/logout-button";

type Props = {
  displayName: string;
  email: string;
};

export function DashboardMobileControls({ displayName, email }: Props) {
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  return (
    <div className="md:hidden">
      <div className="mb-3 flex justify-end">
        <Button variant="outline" className="gap-2" onClick={() => setOpen((prev) => !prev)}>
          <Settings className="size-4" />
          Opcoes
        </Button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mb-4 space-y-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div>
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-zinc-500">{email}</p>
            </div>

            <div className="space-y-2">
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

            <div>
              <p className="mb-2 text-xs uppercase text-zinc-500">Aplicativo</p>
              <InstallAppButton />
            </div>

            <LogoutButton />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

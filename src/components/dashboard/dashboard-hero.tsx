"use client";

import { motion } from "framer-motion";
import { LogoutButton } from "@/components/auth/logout-button";
import { Card } from "@/components/ui/card";

type Metrics = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  extraMile: number;
};

type Props = {
  displayName: string;
  metrics: Metrics;
};

const metricCards = [
  { key: "total", label: "Total", color: "border-l-indigo-500" },
  { key: "pending", label: "Pendentes", color: "border-l-amber-500" },
  { key: "inProgress", label: "Em progresso", color: "border-l-sky-500" },
  { key: "completed", label: "Concluidas", color: "border-l-emerald-500" },
  { key: "extraMile", label: "Extra mile", color: "border-l-violet-500" },
] as const;

export function DashboardHero({ displayName, metrics }: Props) {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">MyTasks Dashboard</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Visao geral da sua rotina - {displayName}</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <LogoutButton />
        </motion.div>
      </motion.header>

      <section className="grid gap-3 md:grid-cols-5">
        {metricCards.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.04 }}
            whileHover={{ y: -2 }}
          >
            <Card className={`border-l-4 ${item.color}`}>
              <p className="text-xs uppercase text-zinc-500">{item.label}</p>
              <p className="text-2xl font-bold">{metrics[item.key]}</p>
            </Card>
          </motion.div>
        ))}
      </section>
    </>
  );
}

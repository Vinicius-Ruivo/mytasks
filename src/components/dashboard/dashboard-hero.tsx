"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

type Metrics = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  extraMile: number;
};

type Props = {
  metrics: Metrics;
};

const metricCards = [
  { key: "total", label: "Total", color: "border-l-indigo-500" },
  { key: "pending", label: "Pendentes", color: "border-l-amber-500" },
  { key: "inProgress", label: "Em progresso", color: "border-l-sky-500" },
  { key: "completed", label: "Concluidas", color: "border-l-emerald-500" },
  { key: "extraMile", label: "Extra mile", color: "border-l-violet-500" },
] as const;

export function DashboardHero({ metrics }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-zinc-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/85"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">MyTasks</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Resumo rapido do que esta em movimento.</p>
      </motion.header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {metricCards.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.04 }}
            whileHover={{ y: -2 }}
            className="min-w-0"
          >
            <Card className={`border-l-4 ${item.color} p-4`}>
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">{item.label}</p>
              <p className="mt-1 tabular-nums text-xl font-bold tracking-tight lg:text-2xl">{metrics[item.key]}</p>
            </Card>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

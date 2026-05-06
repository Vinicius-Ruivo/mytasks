"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

type FocusItem = {
  blockId: string;
  blockName: string;
  total: number;
  completed: number;
};

type Props = {
  items: FocusItem[];
};

function percent(value: number, total: number) {
  if (total === 0) {
    return 0;
  }
  return Math.round((value / total) * 100);
}

export function FocusMap({ items }: Props) {
  const totalCompleted = items.reduce((sum, item) => sum + item.completed, 0);
  const hasData = items.length > 0;

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Mapa de foco</h2>
          <p className="text-xs text-zinc-500">Tamanho do bloco = tarefas concluidas na area</p>
        </div>
      </div>

      {!hasData ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
          Crie blocos e conclua tarefas para visualizar seu foco por area.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          {items.map((item, index) => {
            const colSpan = Math.max(3, Math.min(12, item.completed * 3 || 3));
            const completedPercent = percent(item.completed, item.total);
            const overallPercent = percent(item.completed, totalCompleted);

            return (
              <motion.div
                key={item.blockId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="h-full rounded-xl border border-zinc-200 bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-violet-500/10 p-4 dark:border-zinc-800">
                  <p className="text-sm font-semibold">{item.blockName}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {item.completed} concluidas de {item.total} tarefas
                  </p>
                  <div className="mt-3 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${completedPercent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    {completedPercent}% de conclusao | {overallPercent}% da sua entrega total
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

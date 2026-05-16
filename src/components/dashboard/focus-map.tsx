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
    <Card className="p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Mapa de foco</h2>
          <p className="text-xs text-zinc-500">Progresso por area (cartoes com o mesmo tamanho)</p>
        </div>
      </div>

      {!hasData ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
          Crie blocos e conclua tarefas para visualizar seu foco por area.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const completedPercent = percent(item.completed, item.total);
            const overallPercent = percent(item.completed, totalCompleted);

            return (
              <motion.li
                key={item.blockId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                whileHover={{ y: -2 }}
                className="min-h-[120px] min-w-0 list-none"
              >
                <div className="flex h-full flex-col rounded-xl border border-zinc-200 bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-violet-500/10 p-4 dark:border-zinc-800">
                  <p className="truncate text-sm font-semibold">{item.blockName}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {item.completed} de {item.total} concluidas
                  </p>
                  <div className="mt-auto pt-3">
                    <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${completedPercent}%` }} />
                    </div>
                    <p className="mt-2 text-[11px] leading-snug text-zinc-500">
                      {completedPercent}% no bloco · {overallPercent}% do total entregue
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

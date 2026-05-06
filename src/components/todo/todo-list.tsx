"use client";

import { AnimatePresence, motion } from "framer-motion";
import { deleteTodo, updateTodo } from "@/actions/todo.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Todo = {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  isExtraMile: boolean;
};

const statusLabel: Record<Todo["status"], string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em progresso",
  COMPLETED: "Concluída",
};

export function TodoList({ todos }: { todos: Todo[] }) {
  const handleToggle = async (todo: Todo) => {
    const nextStatus = todo.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    await updateTodo({ id: todo.id, status: nextStatus });

    if (nextStatus === "COMPLETED" && typeof window !== "undefined") {
      navigator.vibrate?.(30);
      const audioContext = new window.AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.05;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.08);
    }
  };

  return (
    <AnimatePresence mode="popLayout">
      <div className="grid gap-3">
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <Card
              className={
                todo.isExtraMile
                  ? "bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-cyan-500/10 border-indigo-300/40 dark:border-indigo-500/30"
                  : ""
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{todo.title}</p>
                  {todo.description ? (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{todo.description}</p>
                  ) : null}
                </div>
                <Badge>{statusLabel[todo.status]}</Badge>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => void handleToggle(todo)}>
                  {todo.status === "COMPLETED" ? "Reabrir" : "Concluir"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => void updateTodo({ id: todo.id, isExtraMile: !todo.isExtraMile })}
                >
                  Extra mile
                </Button>
                <Button size="sm" variant="destructive" onClick={() => void deleteTodo({ id: todo.id })}>
                  Excluir
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}

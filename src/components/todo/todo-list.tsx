"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createTodoNote, deleteTodo, updateTodo } from "@/actions/todo.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Todo = {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  isExtraMile: boolean;
  block: { id: string; name: string } | null;
  notes: { id: string; content: string; createdAt: string | Date }[];
};

const statusLabel: Record<Todo["status"], string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em progresso",
  COMPLETED: "Concluída",
};

export function TodoList({ todos, blocks }: { todos: Todo[]; blocks: { id: string; name: string }[] }) {
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
            whileHover={{ y: -2 }}
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
                  {todo.block ? <p className="text-xs text-indigo-500 mt-1">Bloco: {todo.block.name}</p> : null}
                  {todo.description ? (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{todo.description}</p>
                  ) : null}
                </div>
                <Badge>{statusLabel[todo.status]}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
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
                <select
                  className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs dark:border-zinc-800 dark:bg-zinc-950"
                  defaultValue={todo.block?.id ?? ""}
                  onChange={(e) => void updateTodo({ id: todo.id, blockId: e.target.value || null })}
                >
                  <option value="">Sem bloco</option>
                  {blocks.map((block) => (
                    <option key={block.id} value={block.id}>
                      {block.name}
                    </option>
                  ))}
                </select>
                <Button size="sm" variant="destructive" onClick={() => void deleteTodo({ id: todo.id })}>
                  Excluir
                </Button>
              </div>

              <div className="mt-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Anotacoes</p>
                <form
                  className="mb-2 flex gap-2"
                  action={(formData) => {
                    const content = String(formData.get(`note-${todo.id}`) ?? "");
                    void createTodoNote({ todoId: todo.id, content });
                  }}
                >
                  <input
                    name={`note-${todo.id}`}
                    className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-xs dark:border-zinc-800 dark:bg-zinc-950"
                    placeholder="Adicionar detalhe, contexto, insight..."
                    required
                    maxLength={1200}
                  />
                  <Button size="sm" variant="outline" type="submit">
                    Salvar
                  </Button>
                </form>

                <div className="space-y-2">
                  {todo.notes.length === 0 ? (
                    <p className="text-xs text-zinc-500">Sem anotacoes ainda.</p>
                  ) : (
                    todo.notes.map((note) => (
                      <div key={note.id} className="rounded-md bg-zinc-100/80 p-2 text-xs dark:bg-zinc-800/70">
                        <p className="text-zinc-700 dark:text-zinc-200">{note.content}</p>
                        <p className="mt-1 text-[11px] text-zinc-500">
                          {new Date(note.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}

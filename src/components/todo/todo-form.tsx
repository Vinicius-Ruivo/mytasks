"use client";

import { useTransition } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { createLifeBlock, createTodo } from "@/actions/todo.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : "Adicionar"}
    </Button>
  );
}

type Block = {
  id: string;
  name: string;
};

export function TodoForm({ blocks }: { blocks: Block[] }) {
  const [, startTransition] = useTransition();

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
      <form
        className="space-y-4"
        action={(formData) => {
          const title = String(formData.get("title") ?? "");
          const description = String(formData.get("description") ?? "");
          const isExtraMile = Boolean(formData.get("isExtraMile"));
          const blockIdRaw = String(formData.get("blockId") ?? "");
          const blockId = blockIdRaw === "" ? null : blockIdRaw;

          startTransition(async () => {
            await createTodo({ title, description, isExtraMile, blockId });
          });
        }}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Titulo da tarefa</label>
            <Input required minLength={1} maxLength={120} name="title" placeholder="Ex: Revisar proposta" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Bloco</label>
            <select
              name="blockId"
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              defaultValue=""
            >
              <option value="">Sem bloco</option>
              {blocks.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Descricao (opcional)</label>
          <Input name="description" maxLength={500} placeholder="Detalhes relevantes para executar melhor a tarefa" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isExtraMile" />
            Marcar como extra mile
          </label>
          <SubmitButton />
        </div>
      </form>

      <motion.form
        className="mt-5 space-y-3 rounded-lg border border-dashed border-zinc-300 p-3 dark:border-zinc-700"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.05 }}
        action={(formData) => {
          const name = String(formData.get("blockName") ?? "");
          const color = String(formData.get("blockColor") ?? "");
          startTransition(async () => {
            await createLifeBlock({ name, color: color || null });
          });
        }}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Criar novo bloco</p>
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input name="blockName" maxLength={40} placeholder="Ex: Pessoal, Trabalho, Estudos..." required />
          <Input name="blockColor" maxLength={20} placeholder="Cor opcional (ex: #3b82f6)" />
          <Button type="submit" variant="secondary">
            Criar bloco
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
}

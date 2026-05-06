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
        className="flex flex-col gap-2 md:flex-row"
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
        <Input required minLength={1} maxLength={120} name="title" placeholder="Nova tarefa..." />
        <Input name="description" maxLength={500} placeholder="Descrição (opcional)" />
        <select
          name="blockId"
          className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
          defaultValue=""
        >
          <option value="">Sem bloco</option>
          {blocks.map((block) => (
            <option key={block.id} value={block.id}>
              {block.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isExtraMile" />
          Extra mile
        </label>
        <SubmitButton />
      </form>
      <motion.form
        className="mt-3 flex gap-2"
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
        <Input name="blockName" maxLength={40} placeholder="Novo bloco (ex: Pessoal, Trabalho...)" required />
        <Input name="blockColor" maxLength={20} placeholder="Cor opcional (ex: #3b82f6)" />
        <Button type="submit" variant="secondary">
          Criar bloco
        </Button>
      </motion.form>
    </motion.div>
  );
}

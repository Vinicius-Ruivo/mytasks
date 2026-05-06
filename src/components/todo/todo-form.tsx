"use client";

import { useTransition } from "react";
import { useFormStatus } from "react-dom";
import { createTodo } from "@/actions/todo.actions";
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

export function TodoForm() {
  const [, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-2 md:flex-row"
      action={(formData) => {
        const title = String(formData.get("title") ?? "");
        const description = String(formData.get("description") ?? "");
        const isExtraMile = Boolean(formData.get("isExtraMile"));

        startTransition(async () => {
          await createTodo({ title, description, isExtraMile });
        });
      }}
    >
      <Input required minLength={1} maxLength={120} name="title" placeholder="Nova tarefa..." />
      <Input name="description" maxLength={500} placeholder="Descrição (opcional)" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isExtraMile" />
        Extra mile
      </label>
      <SubmitButton />
    </form>
  );
}

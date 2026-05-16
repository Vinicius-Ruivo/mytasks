"use client";

import { useTransition, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { createLifeBlock, createTemplate, createTodo, createTodoFromTemplate } from "@/actions/todo.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  color: string | null;
};

type Template = {
  id: string;
  name: string;
};

function blockAccent(color: string | null | undefined) {
  if (!color || !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color.trim())) return undefined;
  return color.trim();
}

function BlockChip({
  label,
  selected,
  onClick,
  accentColor,
  className,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  accentColor?: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={selected ? "default" : "outline"}
      className={cn("shrink-0 rounded-full gap-1.5 px-3", className)}
      aria-pressed={selected}
      onClick={onClick}
    >
      {accentColor ? (
        <span className="size-2 shrink-0 rounded-full ring-1 ring-black/10 dark:ring-white/15" style={{ backgroundColor: accentColor }} />
      ) : null}
      {label}
    </Button>
  );
}

export function TodoForm({ blocks, templates }: { blocks: Block[]; templates: Template[] }) {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const [taskAreaId, setTaskAreaId] = useState("");
  const [templateAreaId, setTemplateAreaId] = useState("");
  const [createAreaOpen, setCreateAreaOpen] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="space-y-4">
      <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Area ou projeto</p>
          <p className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-400">
            Escolha onde esta tarefa entra na sua rotina — igual aos filtros da lista.
          </p>
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <BlockChip label="Sem area" selected={taskAreaId === ""} onClick={() => setTaskAreaId("")} />
          {blocks.map((block) => (
            <BlockChip
              key={block.id}
              label={block.name}
              selected={taskAreaId === block.id}
              accentColor={blockAccent(block.color)}
              onClick={() => setTaskAreaId(block.id)}
            />
          ))}
          <Button
            type="button"
            size="sm"
            variant={createAreaOpen ? "secondary" : "outline"}
            className="shrink-0 rounded-full gap-1 px-3"
            onClick={() => setCreateAreaOpen((v) => !v)}
            aria-expanded={createAreaOpen}
          >
            <Plus className="size-3.5" />
            Nova area
          </Button>
        </div>

        <AnimatePresence initial={false}>
          {createAreaOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <form
                key={`new-area-${blocks.length}`}
                className="mt-2 flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-950"
                action={(formData) => {
                  const name = String(formData.get("newAreaName") ?? "");
                  const colorHex = String(formData.get("newAreaColor") ?? "").trim();
                  startTransition(async () => {
                    await createLifeBlock({ name, color: colorHex || null });
                    router.refresh();
                    setCreateAreaOpen(false);
                  });
                }}
              >
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Criar uma nova area</p>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="min-w-[160px] flex-1 space-y-1">
                    <label className="text-[11px] uppercase text-zinc-500">Nome</label>
                    <Input name="newAreaName" maxLength={40} placeholder="Ex: Trabalho, Saude, Side project" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase text-zinc-500">Cor</label>
                    <input
                      type="color"
                      name="newAreaColor"
                      defaultValue="#6366f1"
                      className="h-10 w-14 cursor-pointer rounded-md border border-zinc-200 bg-transparent p-1 dark:border-zinc-700"
                      title="Cor do marcador"
                    />
                  </div>
                  <Button type="submit" size="sm" variant="secondary" className="shrink-0">
                    Criar e listar
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <form
        className="space-y-4"
        action={(formData) => {
          const title = String(formData.get("title") ?? "");
          const description = String(formData.get("description") ?? "");
          const isExtraMile = Boolean(formData.get("isExtraMile"));
          const blockId = taskAreaId === "" ? null : taskAreaId;
          const priorityRaw = String(formData.get("priority") ?? "MEDIUM");
          const priority = (["LOW", "MEDIUM", "HIGH", "URGENT"].includes(priorityRaw) ? priorityRaw : "MEDIUM") as
            | "LOW"
            | "MEDIUM"
            | "HIGH"
            | "URGENT";
          const dueDateRaw = String(formData.get("dueDate") ?? "");
          const dueDate = dueDateRaw ? new Date(`${dueDateRaw}T00:00:00`).toISOString() : null;

          startTransition(async () => {
            await createTodo({ title, description, isExtraMile, blockId, priority, dueDate });
          });
        }}
      >
        <input type="hidden" name="blockId" value={taskAreaId} />

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Titulo da tarefa</label>
          <Input required minLength={1} maxLength={120} name="title" placeholder="Ex: Revisar proposta" />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Prioridade</label>
            <select
              name="priority"
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              defaultValue="MEDIUM"
            >
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Vencimento</label>
            <Input type="date" name="dueDate" />
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
        className="mt-5 space-y-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.04 }}
        action={(formData) => {
          const templateId = String(formData.get("templateId") ?? "");
          const blockId = templateAreaId === "" ? null : templateAreaId;
          if (!templateId) return;
          startTransition(async () => {
            await createTodoFromTemplate({ templateId, blockId });
          });
        }}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Usar template</p>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <select
            name="templateId"
            className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            defaultValue=""
            required
          >
            <option value="">Selecione um template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <Button type="submit" variant="secondary">
            Criar por template
          </Button>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] uppercase text-zinc-500">Area para esta tarefa</p>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <BlockChip label="Sem area" selected={templateAreaId === ""} onClick={() => setTemplateAreaId("")} />
            {blocks.map((block) => (
              <BlockChip
                key={block.id}
                label={block.name}
                selected={templateAreaId === block.id}
                accentColor={blockAccent(block.color)}
                onClick={() => setTemplateAreaId(block.id)}
              />
            ))}
          </div>
        </div>
      </motion.form>

      <motion.form
        className="mt-5 space-y-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.06 }}
        action={(formData) => {
          const name = String(formData.get("templateName") ?? "");
          const title = String(formData.get("templateTitle") ?? "");
          const description = String(formData.get("templateDescription") ?? "");
          const subtasksRaw = String(formData.get("templateSubtasks") ?? "");
          const checklistRaw = String(formData.get("templateChecklist") ?? "");
          const priorityRaw = String(formData.get("templatePriority") ?? "MEDIUM");
          const priority = (["LOW", "MEDIUM", "HIGH", "URGENT"].includes(priorityRaw) ? priorityRaw : "MEDIUM") as
            | "LOW"
            | "MEDIUM"
            | "HIGH"
            | "URGENT";
          const subtasks = subtasksRaw
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .slice(0, 30);
          const checklist = checklistRaw
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .slice(0, 40);
          startTransition(async () => {
            await createTemplate({ name, title, description: description || null, priority, subtasks, checklist });
          });
        }}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Salvar template</p>
        <div className="grid gap-3 md:grid-cols-2">
          <Input name="templateName" maxLength={40} placeholder="Nome do template (ex: Daily Deep Work)" required />
          <Input name="templateTitle" maxLength={120} placeholder="Titulo da tarefa" required />
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input name="templateDescription" maxLength={500} placeholder="Descricao opcional" />
          <select
            name="templatePriority"
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            defaultValue="MEDIUM"
          >
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <textarea
            name="templateSubtasks"
            className="min-h-24 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            placeholder={"Subtarefas padrao (1 por linha)\nEx:\nPreparar contexto\nExecutar foco de 60min"}
            maxLength={4000}
          />
          <textarea
            name="templateChecklist"
            className="min-h-24 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            placeholder={"Checklist padrao (1 por linha)\nEx:\nAmbiente pronto\nEntregavel revisado"}
            maxLength={4000}
          />
        </div>
        <Button type="submit" variant="secondary">
          Salvar template
        </Button>
      </motion.form>
    </motion.div>
  );
}

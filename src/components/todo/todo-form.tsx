"use client";

import { useTransition, useState, useMemo } from "react";
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

function UseTemplateSubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" className="w-full sm:w-auto sm:min-w-[220px]" disabled={disabled || pending}>
      {pending ? "Gerando..." : "Gerar tarefa"}
    </Button>
  );
}

function SaveTemplateSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
      {pending ? "Salvando modelo..." : "Salvar modelo"}
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

type TodoPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

const PRIORITY_OPTIONS: { value: TodoPriority; label: string }[] = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Media" },
  { value: "HIGH", label: "Alta" },
  { value: "URGENT", label: "Urgente" },
];

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
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [newTemplatePriority, setNewTemplatePriority] = useState<TodoPriority>("MEDIUM");
  const [createAreaOpen, setCreateAreaOpen] = useState(false);

  const effectiveTemplateId = useMemo(() => {
    if (templates.length === 0) return "";
    if (selectedTemplateId && templates.some((t) => t.id === selectedTemplateId)) {
      return selectedTemplateId;
    }
    return templates[0].id;
  }, [templates, selectedTemplateId]);

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

        <div className="max-w-xl space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Titulo da tarefa</label>
            <Input required minLength={1} maxLength={120} name="title" placeholder="Ex: Revisar proposta" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
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

          <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isExtraMile" />
              Marcar como extra mile
            </label>
            <SubmitButton />
          </div>
        </div>
      </form>

      <motion.form
        className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 md:p-5 dark:border-zinc-800 dark:bg-zinc-900/40"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.04 }}
        action={() => {
          const templateId = effectiveTemplateId;
          const blockId = templateAreaId === "" ? null : templateAreaId;
          if (!templateId) return;
          startTransition(async () => {
            await createTodoFromTemplate({ templateId, blockId });
            router.refresh();
          });
        }}
      >
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Usar modelo</p>
          <p className="text-[13px] text-zinc-600 dark:text-zinc-400">
            Toque no modelo e escolha a area. Uma nova tarefa e criada com titulo, prioridade e checklist padrao do modelo.
          </p>
        </div>

        {templates.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-zinc-300 px-3 py-4 text-sm text-zinc-500 dark:border-zinc-600">
            Nenhum modelo ainda. Use &quot;Salvar modelo&quot; abaixo para guardar um fluxo que voce repete.
          </p>
        ) : (
          <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {templates.map((template) => (
              <Button
                key={template.id}
                type="button"
                size="sm"
                variant={effectiveTemplateId === template.id ? "default" : "outline"}
                className="shrink-0 rounded-full px-3"
                aria-pressed={effectiveTemplateId === template.id}
                onClick={() => setSelectedTemplateId(template.id)}
              >
                {template.name}
              </Button>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500">Area da nova tarefa</p>
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

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <UseTemplateSubmitButton disabled={templates.length === 0 || effectiveTemplateId === ""} />
        </div>
      </motion.form>

      <motion.form
        className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 md:p-5 dark:border-zinc-800 dark:bg-zinc-900/40"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.06 }}
        action={(formData) => {
          const name = String(formData.get("templateName") ?? "");
          const title = String(formData.get("templateTitle") ?? "");
          const description = String(formData.get("templateDescription") ?? "");
          const subtasksRaw = String(formData.get("templateSubtasks") ?? "");
          const checklistRaw = String(formData.get("templateChecklist") ?? "");
          const priority = newTemplatePriority;
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
            router.refresh();
          });
        }}
      >
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Salvar modelo</p>
          <p className="text-[13px] text-zinc-600 dark:text-zinc-400">
            Guarde um jeito de trabalhar que voce repete: nome amigavel, titulo que a tarefa vai usar e opcionalmente subtarefas/checklist por linha.
          </p>
        </div>

        <div className="mx-auto mt-4 max-w-2xl space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="templateName" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              Nome do modelo (lista)
            </label>
            <Input
              id="templateName"
              name="templateName"
              maxLength={40}
              placeholder="Ex: Review semanal, Sprint planning"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="templateTitle" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              Titulo da tarefa gerada
            </label>
            <Input id="templateTitle" name="templateTitle" maxLength={120} placeholder="Ex: Revisar backlog do time" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="templateDescription" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Descricao padrao (opcional)
          </label>
          <Input
            id="templateDescription"
            name="templateDescription"
            maxLength={500}
            placeholder="Contexto que sempre vale para este modelo"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Prioridade padrao</p>
          <div className="flex flex-wrap gap-2">
            {PRIORITY_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                size="sm"
                variant={newTemplatePriority === opt.value ? "default" : "outline"}
                className="rounded-full px-3"
                aria-pressed={newTemplatePriority === opt.value}
                onClick={() => setNewTemplatePriority(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="templateSubtasks" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              Subtarefas padrao (uma por linha)
            </label>
            <textarea
              id="templateSubtasks"
              name="templateSubtasks"
              className="min-h-[100px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              placeholder={"Preparar contexto\nExecutar foco de 60 min"}
              maxLength={4000}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="templateChecklist" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              Checklist padrao (uma por linha)
            </label>
            <textarea
              id="templateChecklist"
              name="templateChecklist"
              className="min-h-[100px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              placeholder={"Ambiente organizado\nEntregavel revisado"}
              maxLength={4000}
            />
          </div>
        </div>
        </div>

        <div className="mx-auto mt-4 max-w-2xl">
          <SaveTemplateSubmitButton />
        </div>
      </motion.form>
    </motion.div>
  );
}

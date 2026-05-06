"use client";

import { useTransition } from "react";
import { updateNickname } from "@/actions/profile.actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NicknameOnboarding() {
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="border-indigo-300/40 bg-indigo-500/5">
      <h2 className="text-lg font-semibold">Antes de comecar...</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        Como voce deseja ser chamado dentro da aplicacao?
      </p>

      <form
        className="mt-4 flex flex-col gap-2 md:flex-row"
        action={(formData) => {
          const nickname = String(formData.get("nickname") ?? "");
          startTransition(async () => {
            await updateNickname({ nickname });
          });
        }}
      >
        <Input name="nickname" minLength={2} maxLength={30} placeholder="Seu apelido" required />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar apelido"}
        </Button>
      </form>
    </Card>
  );
}

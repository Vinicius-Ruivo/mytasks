"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await signIn("email", { email, redirect: false, callbackUrl: "/dashboard" });
    setLoading(false);
    setMessage(res?.ok ? "Link mágico enviado para seu e-mail." : "Não foi possível enviar o link.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Entrar no MyTasks</h1>
        <form onSubmit={onMagicLink} className="space-y-3">
          <Input
            required
            type="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Entrar com Magic Link"}
          </Button>
        </form>
        <Button className="w-full" variant="secondary" onClick={() => void signIn("google", { callbackUrl: "/dashboard" })}>
          Continuar com Google
        </Button>
        {message ? <p className="text-sm text-zinc-600 dark:text-zinc-300">{message}</p> : null}
      </Card>
    </main>
  );
}

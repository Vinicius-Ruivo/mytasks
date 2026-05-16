"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function AppFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mt-auto border-t border-zinc-200/90 bg-gradient-to-b from-transparent to-zinc-100/90 px-4 py-5 dark:border-zinc-800 dark:to-zinc-950/90"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-1 text-center">
        <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[13px] text-zinc-600 dark:text-zinc-400">
          <span className="font-medium tracking-tight text-zinc-800 dark:text-zinc-200">MyTasks</span>
          <span aria-hidden className="text-zinc-300 dark:text-zinc-600">
            ·
          </span>
          <span>Criado por</span>
          <Link
            href="https://github.com/Vinicius-Ruivo"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text font-semibold text-transparent underline-offset-4 transition hover:underline"
          >
            Ruivo
          </Link>
        </p>
        <p className="max-w-md text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-500">
          Organize foco, áreas da vida e entregas — com segurança e cara de app nativo.
        </p>
      </div>
    </motion.footer>
  );
}

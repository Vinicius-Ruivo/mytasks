## MyTasks PWA (Production Ready)

Aplicação full-stack com foco em segurança:

- Next.js 16 + TypeScript strict
- Auth.js (Google OAuth + Magic Link)
- Prisma + PostgreSQL
- Validação com Zod e proteção contra IDOR
- PWA com Service Worker e suporte offline

## 1) Configuração de ambiente

Copie `.env.example` para `.env` e preencha:

- `DATABASE_URL` para um PostgreSQL estável (Neon, Supabase, Railway, RDS ou local)
- `NEXTAUTH_SECRET` com um segredo forte
- `NEXTAUTH_URL` com a URL pública da aplicação
- credenciais de Google OAuth (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) e/ou SMTP (`EMAIL_SERVER`, `EMAIL_FROM`)

## 2) Instalação e banco

```bash
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
```

> Em dev local, se preferir sincronização rápida sem histórico de migrations:

```bash
npm run prisma:push
```

## 3) Executar

```bash
npm run dev
```

## 4) Checks de produção

```bash
npm run lint
npm run build
```

## Segurança implementada

- Proteção de rota via `src/proxy.ts`
- Security headers centralizados em `next.config.ts`
- Sanitização de texto em `src/lib/security.ts`
- Validação Zod em `src/schemas/todo.schema.ts`
- CRUD vinculado ao `session.user.id` em `src/actions/todo.actions.ts`

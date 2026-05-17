# Escola Inglês Pareto - App

## Antes de qualquer coisa
Leia `CONTEXT.md` se precisar de histórico ou contexto profundo. Este arquivo é o resumo operacional.

## O que é
Plataforma SaaS de ensino de inglês com agendamento via Google Calendar, sistema de créditos, fórum da comunidade e assistente IA conversacional (Gemini).

## Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Integrações**: Google Calendar API (OAuth2), MercadoPago, Google Gemini AI
- **Estado**: TanStack Query + React Hooks
- **Roteamento**: React Router v6
- **Deploy**: Vercel (`vercel.json` presente)
- **Testes**: Vitest + Playwright (e2e)

## Como rodar
```bash
pnpm install
pnpm dev         # servidor de desenvolvimento
pnpm build       # build de produção
pnpm test        # testes unitários (vitest)
pnpm test:e2e    # testes e2e (playwright)
```

## Estado atual (2026-05-17)
- 26 telas implementadas (admin, professor, aluno, fórum, pagamentos, IA)
- Telas de admin/professor adicionadas no último commit (a5f941a)
- Build limpo, zero erros TypeScript
- Fórum com código pronto mas aguardando migration SQL no Supabase
- Google Calendar: código pronto, requer configuração OAuth2 em produção

## Próxima feature planejada
- Ativar persistência real do fórum (migration SQL em `migrations/`)
- Ver `ROADMAP.md` para lista completa de features pendentes
- Specs em `docs/features/` quando criados

## Regras críticas
- Nunca hardcode credenciais — usar `.env` (ver `.env.example`)
- Spec aprovado em `docs/features/feature-NNN.md` antes de qualquer nova feature
- Supabase RLS deve ser mantido em todas as novas tabelas
- Commits devem deixar o projeto em estado rodável
- `CONTEXT.md` para histórico; este arquivo apenas para status operacional

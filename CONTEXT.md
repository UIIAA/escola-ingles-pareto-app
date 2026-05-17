# Contexto do Projeto — Escola Inglês Pareto App

## História
Plataforma de ensino de inglês criada para a "Escola Inglês Pareto". Desenvolvida como SaaS completo com foco em agendamento integrado ao Google Calendar, sistema de créditos para aulas individuais e em grupo, fórum da comunidade e assistente IA conversacional.

Marcos importantes:
- Projeto iniciado em meados de 2024
- Set/2024: análise inicial de projeto (`PROJETO_ANALISE_15_SET_2024.md`)
- Set/2025: correções críticas pós-teste de usuário (commit d7673dc — 6 correções)
- Out/2025: agendamento de professor V2 (multi-aluno + aulas abertas + Google Calendar real)
- Out/2025: auto-inclusão de professor como organizador de evento
- Mai/2026: adição de telas de admin/professor e refinamento de documentação (commit a5f941a)

## Decisões Arquitetônicas (ADRs)

### ADR-001: Supabase como Backend
**Data:** 2024
**Contexto:** Precisava de auth, banco relacional, storage e RLS sem infra própria.
**Decisão:** Supabase (PostgreSQL + Auth + Storage).
**Consequências:** Lock-in no Supabase, mas velocidade de desenvolvimento alta. RLS é obrigatório em todas as tabelas.

### ADR-002: Google Calendar como fonte da verdade de agendamento
**Data:** Out/2025
**Contexto:** Professores já usam Google Calendar; sincronização bidirecional é critério de adoção.
**Decisão:** Integração OAuth2 direta com Google Calendar API. Calendário único "Aulas Inglês Pareto". Google Meet gerado automaticamente.
**Consequências:** Requer setup OAuth2 por usuário professor. Código pronto, ativação manual necessária.

### ADR-003: Sistema de créditos (não assinaturas mensais)
**Data:** 2024
**Contexto:** Flexibilidade para alunos que não têm frequência fixa.
**Decisão:** Créditos compráveis em pacotes (Iniciante 12, Padrão 30, Premium 65, Individual 18). Grupo = 1 crédito, Individual = 3 créditos.
**Consequências:** Lógica de débito/crédito em todas as transações de aula.

### ADR-004: Gemini AI para assistente conversacional
**Data:** 2025
**Contexto:** Prática de inglês fora das aulas via chat IA.
**Decisão:** Google Gemini (`@google/generative-ai`) integrado diretamente no frontend.
**Consequências:** API key exposta no client — avaliar migrar para edge function em produção.

### ADR-005: Vite + React 18 (não Next.js)
**Data:** 2024
**Contexto:** SPA pura, sem necessidade de SSR/SSG inicialmente.
**Decisão:** Vite + React Router v6.
**Consequências:** Deploy no Vercel como SPA (vercel.json com rewrites). SEO limitado — não é prioridade atual.

## Stakeholders e Contexto de Negócio
- **Dono/Admin**: gerencia professores, alunos, créditos, pagamentos
- **Professores**: criam e gerenciam aulas, visualizam agenda no Google Calendar
- **Alunos**: compram créditos, agendam aulas, usam fórum e IA

## Glossário do Domínio
- **Crédito**: unidade de compra de aulas (grupo=1, individual=3)
- **Aula Aberta**: aula sem alunos pré-inscritos, qualquer aluno com crédito pode entrar
- **Temas Universais**: 7 temas de conversação (Relacionamentos, Trabalho, Vida Urbana, Saúde, Viagem, Tecnologia, Entretenimento)
- **Horizonte**: pasta/tema relacionado ao design system alternativo (`Horizon/`, `Horizon_unzipped/`)
- **Migration**: arquivo SQL em `migrations/` para aplicar no Supabase Dashboard

## Aprendizados / Cicatrizes
- Fórum foi implementado com mock data primeiro — migration SQL está pronta em `migrations/` mas precisa ser executada manualmente no Supabase Dashboard antes de ligar o código real
- Google Calendar OAuth2 requer configuração por ambiente (dev vs prod) — IDs de cliente diferentes
- Gemini API key no frontend é risco de segurança — pendente migração para edge function
- Build com `vite build` gera ~1.86MB (413KB gzipped) — monitorar se crescer

## Roadmap Detalhado
Ver `ROADMAP.md` para lista completa. Resumo das prioridades:

**Fase 1 — Ativação imediata (pronto, só falta ligar):**
1. Fórum com Supabase real (migration SQL + trocar mock no `Forum.tsx`)
2. Upload de vídeos via Supabase Storage
3. Configurar Google Calendar em produção

**Fase 2 — Features novas:**
- Notificações push
- Relatórios para admin
- App mobile (React Native ou PWA)

## FAQ
**P: Por que tem tantos arquivos `.md` na raiz?**
R: Documentação acumulada de sessões anteriores. Candidatos a mover para `docs/` ou arquivar.

**P: O que é a pasta `Horizon/`?**
R: Design system/tema alternativo baixado para referência. Não está em uso ativo.

**P: Por que `pnpm` e `package-lock.json` coexistem?**
R: `package-lock.json` pode ser artefato de `npm install` acidental. Usar `pnpm` como padrão.

## Links Externos Relevantes
- Supabase Dashboard: configurar via variáveis de ambiente em `.env`
- Google Cloud Console: credenciais OAuth2 para Calendar API
- MercadoPago: credenciais de pagamento
- Vercel: deploy automático via `vercel.json`

## Apêndice Técnico
- `src/` — código fonte principal
- `api/` — edge functions (se existirem)
- `migrations/` — SQLs do Supabase (executar no Dashboard, não via CLI)
- `e2e/` — testes Playwright
- `test/` — testes unitários Vitest
- `public/` — assets estáticos
- `tasks/` — artefatos do orquestrador PM (F-011)

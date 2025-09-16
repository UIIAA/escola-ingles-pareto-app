# Arquitetura do Sistema de Gestão de Aulas de Inglês

## Visão Geral
Aplicação web com perfis de Aluno, Professor e Master, integrada ao Google Calendar para agendamento e preparada para pagamentos BR Pay.

## Stack Técnica
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Automação**: Supabase Edge Functions (substituindo N8n inicialmente)
- **Pagamento**: BR Pay API (com fallback para Stripe/PagSeguro)
- **Calendário**: Google Calendar API

## Estrutura de Pastas
```
src/
├── app/                 # Rotas da aplicação
├── components/          # Componentes reutilizáveis
├── lib/                 # Configurações e utilitários
├── hooks/               # Hooks personalizados
├── providers/           # Provedores de contexto
├── types/               # Definições de tipos TypeScript
├── services/            # Integrações com APIs externas
├── utils/               # Funções utilitárias
└── architecture/        # Documentação da arquitetura
```

## Estrutura de Dados Principal
```sql
-- Perfis de usuário
users (id, email, role, name, created_at)
profiles (user_id, phone, timezone, avatar_url)

-- Aulas e agendamentos
lesson_slots (id, teacher_id, datetime, status, google_event_id, duration)
bookings (id, student_id, slot_id, status, created_at)

-- Sistema de créditos
credit_packages (id, student_id, credits_purchased, credits_remaining, expiry_date, discount_applied)
payment_history (id, student_id, amount, credits_purchased, payment_method, status)

-- Conteúdo e materiais
lessons (id, title, description, teacher_id, created_at)
lesson_materials (id, lesson_id, file_url, type)
```

## Fluxos Principais

### 1. Agendamento de Aulas
1. Professor cria disponibilidade → Salva em lesson_slots
2. Sync automático com Google Calendar via API
3. Aluno visualiza slots disponíveis → Seleciona e reserva
4. Sistema deduz créditos do aluno
5. Confirmação automática por email

### 2. Sistema de Créditos
- Compra em múltiplos de 4 (4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52)
- Descontos progressivos:
  - 12 aulas: 5% de desconto
  - 24 aulas: 10% de desconto
  - 36 aulas: 15% de desconto
  - 52 aulas: 20% de desconto
- Alerta quando restam 2 créditos

### 3. Perfis de Usuário
- **Aluno**: Visualiza slots, agenda aulas, gerencia créditos
- **Professor**: Cria disponibilidade, gerencia aulas, acessa materiais
- **Master**: Dashboard completo, relatórios, gestão de usuários

## Integrações Externas
1. **Google Calendar API**: Sincronização de disponibilidade
2. **BR Pay**: Processamento de pagamentos
3. **Email Service**: Confirmações automáticas
4. **Storage**: Armazenamento de materiais de aula

## Pontos de Atenção
✅ **Viável**: Arquitetura modular e escalável
⚠️ **Considerar**:
- Sistema de cancelamento/remarcação
- Histórico de aulas assistidas
- Relatórios para perfil Master
- Notificações push

## MVP Sugerido
1. Autenticação e perfis de usuário
2. Sistema de créditos e pagamentos
3. Agendamento básico de aulas
4. Integração com Google Calendar

**Tempo estimado**: 4-6 semanas para MVP funcional
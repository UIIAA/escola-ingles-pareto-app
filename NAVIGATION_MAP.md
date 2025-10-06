# 🗺️ MAPEAMENTO COMPLETO DE NAVEGAÇÃO - Escola Inglês Pareto

**Data:** 04/10/2025
**Versão:** 1.0
**Status:** 23 rotas funcionais, 2 rotas faltantes, 5 rotas órfãs

---

## 📋 ÍNDICE

1. [Rotas Definidas](#rotas-definidas)
2. [Navegação do Sidebar](#navegação-do-sidebar)
3. [Navegação do Header](#navegação-do-header)
4. [Navegação nos Dashboards](#navegação-nos-dashboards)
5. [Navegação em Páginas Principais](#navegação-em-páginas-principais)
6. [Problemas Identificados](#problemas-identificados)
7. [Telas Faltantes Sugeridas](#telas-faltantes-sugeridas)
8. [Plano de Implementação](#plano-de-implementação)

---

## 📋 ROTAS DEFINIDAS

### Rotas Públicas (sem proteção)
| Path | Componente | Layout | Descrição |
|------|-----------|--------|-----------|
| `/` | Index | Não | Landing page |
| `/login` | Login | Não | Página de login |
| `/register` | Register | Não | Cadastro de usuário |
| `/forgot-password` | ForgotPassword | Não | Recuperação de senha |

### Rotas Protegidas (authenticated users)
| Path | Componente | Layout | Proteção | Descrição |
|------|-----------|--------|----------|-----------|
| `/dashboard` | Dashboard | Sim | ProtectedRoute | Dashboard dinâmico por role |
| `/schedule` | Schedule | Sim | ProtectedRoute | Agendamento de aulas |
| `/learning` | Learning | Sim | ProtectedRoute | Trilhas de aprendizado |
| `/forum` | Forum | Sim | ProtectedRoute | Fórum da comunidade |
| `/ai-chat` | AIChat | Sim | ProtectedRoute | Chat com IA |
| `/credits` | Credits | Sim | ProtectedRoute | Gerenciamento de créditos |
| `/checkout` | Checkout | Sim | ProtectedRoute | Finalizar compra |
| `/payment/success` | PaymentSuccess | Sim | ProtectedRoute | Confirmação de pagamento |
| `/payment/failure` | PaymentFailure | Sim | ProtectedRoute | Falha no pagamento |
| `/profile` | Profile | Sim | ProtectedRoute | Perfil do usuário |

### Rotas de Professores (requiredRole: "teacher")
| Path | Componente | Layout | Proteção | Descrição |
|------|-----------|--------|----------|-----------|
| `/catalog` | ClassCatalog | Sim | teacher | Catálogo de templates de aula |
| `/teaching` | TeacherLessons | Sim | teacher | Gerenciamento de aulas |

### Rotas de Administrador (requiredRole: "master")
| Path | Componente | Layout | Proteção | Descrição |
|------|-----------|--------|----------|-----------|
| `/admin` | Admin | Sim | master | Painel administrativo |
| `/admin/users` | AdminUsers | Sim | master | Gerenciar usuários |
| `/admin/finance` | AdminFinance | Sim | master | Finanças |
| `/admin/analytics` | AdminAnalytics | Sim | master | Analytics |
| `/admin/settings` | AdminSettings | Sim | master | Configurações |
| `/admin/teachers` | AdminTeachers | Sim | master | Gerenciar professores |
| `/admin/lessons` | AdminLessons | Sim | master | Gerenciar aulas |

### Rota Catch-All
| Path | Componente | Layout | Descrição |
|------|-----------|--------|-----------|
| `*` | NotFound | Sim | Página 404 |

**Total: 25 rotas definidas**

---

## 🎯 NAVEGAÇÃO DO SIDEBAR

### Links do Menu Principal

| Label | Path | Ícone | Visível para | Descrição |
|-------|------|-------|--------------|-----------|
| Dashboard | `/dashboard` | LayoutDashboard | Todos | Visão geral |
| Catálogo de Aulas | `/catalog` | BookOpen | teacher, master | Explorar aulas disponíveis |
| Agendamento | `/schedule` | Calendar | Todos | Agendar aulas |
| Aprendizado | `/learning` | Target | Todos | Trilhas e progresso |
| Fórum | `/forum` | MessageSquare | Todos | Discussões e dúvidas |
| Chat IA | `/ai-chat` | Bot | Todos | Prática com IA |
| Créditos | `/credits` | CreditCard | Todos | Gerenciar créditos |
| Ensino | `/teaching` | GraduationCap | teacher, master | Área do professor |
| Perfil | `/profile` | User | Todos | Meu perfil |
| Admin | `/admin` | Settings | master | Administração |

**Total: 10 links**

### Distribuição por Role

- **Alunos (student):** 7 links visíveis
- **Professores (teacher):** 9 links visíveis
- **Administradores (master):** 10 links visíveis

---

## 📱 NAVEGAÇÃO DO HEADER

### Elementos de Navegação

| Elemento | Tipo | Destino/Ação | Descrição |
|----------|------|--------------|-----------|
| Menu/Hamburger | Button | onMenuClick | Abrir sidebar (mobile/tablet) |
| Toggle Sidebar | Button | toggle() | Expandir/recolher sidebar (desktop) |
| Search Bar | Input | Modal de busca | Buscar aulas, professores, tópicos |
| Notification Bell | Button | Modal | Notificações do sistema |
| User Avatar Menu | Dropdown | - | Menu do usuário |
| └─ Perfil | MenuItem | `/profile` | Navegar para perfil |
| └─ Configurações | MenuItem | `/profile` | Navegar para configurações |
| └─ Sair | MenuItem | signOut() + `/login` | Fazer logout |

---

## 🎨 NAVEGAÇÃO NOS DASHBOARDS

### StudentDashboard (`/dashboard` - role: student)

| Botão/Link | Destino | Tipo | Localização |
|------------|---------|------|-------------|
| Agendar Aula | `/catalog` ⚠️ | navigate | Header (ERRO: deveria ser `/schedule`) |
| Comprar mais créditos | `/credits` | navigate | Alerta de créditos baixos |
| Entrar (aula) | - | - | Card de próximas aulas |
| Ver todas as aulas | `/schedule` | navigate | Próximas aulas |
| Continuar Estudando | `/learning` | navigate | Card de progresso |
| Continue sua trilha | `/learning` | navigate | Ações recomendadas |
| Pratique conversação | `/ai-chat` | navigate | Ações recomendadas |
| Participe do fórum | `/forum` | navigate | Ações recomendadas |

### TeacherDashboard (`/dashboard` - role: teacher)

| Botão/Link | Destino | Tipo | Localização |
|------------|---------|------|-------------|
| Agendar Nova Aula | Modal | setState | Header |
| Gerenciar Aulas | `/teaching` | navigate | Header |
| Ver Detalhes (aluno) | Modal | setState | Agenda de hoje |
| Ver agenda completa | `/teaching` | navigate | Agenda de hoje |
| Ver Detalhes (progresso) | Modal | setState | Progresso dos alunos |
| Ver todos os alunos | Modal | setState | Progresso dos alunos |
| Gerenciar Disponibilidade | `/teaching` | navigate | Ações rápidas |
| Templates de Aula | `/teaching` | navigate | Ações rápidas |
| Forum da Comunidade | `/forum` | navigate | Ações rápidas |
| Perfil & Configurações | `/profile` | navigate | Ações rápidas |
| Ver Todas as Aulas | `/teaching` | navigate | Modal de detalhes |

### AdminDashboard (`/dashboard` - role: master)

| Botão/Link | Destino | Tipo | Localização |
|------------|---------|------|-------------|
| Configurações | `/admin/settings` | navigate | Header |
| Gerenciar Usuários | `/admin/users` | navigate | Ações administrativas |
| Gerenciar Professores | `/admin/teachers` | navigate | Ações administrativas |
| Relatórios Financeiros | `/admin/finance` | navigate | Ações administrativas |
| Analytics | `/admin/analytics` | navigate | Ações administrativas |
| Configurações | `/admin/settings` | navigate | Ações (DUPLICADO) |
| Gerenciar Aulas | `/admin/lessons` | navigate | Ações administrativas |
| Ver todos os professores | `/admin/teachers` | navigate | Top professores |

---

## 📄 NAVEGAÇÃO EM PÁGINAS PRINCIPAIS

### Schedule (`/src/pages/Schedule.tsx`)

| Botão/Link | Destino | Descrição |
|------------|---------|-----------|
| Voltar ao Dashboard | `/dashboard` | Link no header |
| Buy Credits (callback) | `/credits` | handleBuyCredits() |

### Credits (`/src/pages/Credits.tsx`)

| Botão/Link | Destino | Descrição |
|------------|---------|-----------|
| Comprar (pacote) | `/checkout?package={id}` | navigate com query param |

### ClassCatalog (`/src/pages/ClassCatalog.tsx`)

| Botão/Link | Destino | Descrição |
|------------|---------|-----------|
| Agendar Aula (card) | Google Calendar | handleBookLesson() |
| Ver Detalhes | Modal | setSelectedTemplate() |
| Agendar Esta Aula (modal) | - | Fecha modal |
| Perguntas (modal) | - | Expand accordion |

### Forum (`/src/pages/Forum.tsx`)

| Botão/Link | Destino | Descrição |
|------------|---------|-----------|
| Novo Tópico | Modal | handleCreateTopic() |
| Back to Forum | Lista | handleBackToList() |
| Create Topic | - | handleSubmitTopic() |
| Post Reply | - | handleSubmitReply() |

### Learning (`/src/pages/Learning.tsx`)

| Botão/Link | Destino | Descrição |
|------------|---------|-----------|
| Adicionar Conteúdo | Modal | Upload vídeo |
| Trilhas | View | setActiveView('paths') |
| Progresso | View | setActiveView('progress') |
| Conquistas | View | setActiveView('achievements') |
| Continuar Estudos | - | handleContinuePath() |
| Iniciar Trilha | - | handleStartPath() |

### TeacherLessons (`/src/pages/TeacherLessons.tsx`)

| Botão/Link | Destino | Descrição |
|------------|---------|-----------|
| Ver (aula criada) | - | View lesson details |
| Editar (aula criada) | - | Edit lesson |
| Criar Aula | Modal | handleTemplateSelect() |
| Cancelar | - | Fechar modal |
| Criar Aula (submit) | - | handleCreateLesson() |

### Profile (`/src/pages/Profile.tsx`)

| Botão/Link | Destino | Descrição |
|------------|---------|-----------|
| Voltar ao Dashboard | `/dashboard` | Link no header |
| Salvar Alterações | - | handleSave() |

### Admin (`/src/pages/Admin.tsx`)

| Botão/Link | Destino | Descrição |
|------------|---------|-----------|
| Voltar ao Dashboard | `/dashboard` | Link no header |
| Gerenciar Usuários | `/admin/users` | Card de gerenciamento |
| Gerenciar Aulas | `/admin/lessons` | Card de gerenciamento |
| Histórico de Pagamentos | `/admin/payments` ❌ | Card (ROTA NÃO EXISTE) |
| Relatórios | `/admin/reports` ❌ | Card (ROTA NÃO EXISTE) |

### AIChat (`/src/pages/AIChat.tsx`)

| Botão/Link | Destino | Descrição |
|------------|---------|-----------|
| Ativar Chat IA | - | activateChatSession() |
| Configurações | - | setShowSettings(true) |
| Nova Conversa | - | startNewSession() |
| Send Message | - | sendMessage() |

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### 🔴 CRÍTICO: Botões que Apontam para Rotas Inexistentes

| ID | Botão | Localização | Destino | Status | Prioridade |
|----|-------|-------------|---------|--------|------------|
| P1 | Histórico de Pagamentos | `/admin` | `/admin/payments` | ❌ Não existe | Alta |
| P2 | Relatórios | `/admin` | `/admin/reports` | ❌ Não existe | Média |

**Impacto:** Usuário clica e recebe 404 ou comportamento inesperado.

---

### 🟡 MÉDIO: Botões Duplicados/Conflitantes

| ID | Botão | Localização | Destino | Problema |
|----|-------|-------------|---------|----------|
| D1 | Agendar Aula | StudentDashboard header | `/catalog` | ⚠️ Deveria ir para `/schedule` |
| D2 | Configurações | AdminDashboard | `/admin/settings` | ⚠️ Aparece 2x (header + ações) |
| D3 | Perfil & Configurações | TeacherDashboard | `/profile` | ⚠️ Redundante com menu user |

**Impacto:** Confusão na navegação, experiência inconsistente.

---

### 🔵 INFO: Rotas Definidas mas Órfãs (sem link direto)

| ID | Rota | Componente | Acesso Atual | Problema |
|----|------|-----------|--------------|----------|
| O1 | `/checkout` | Checkout | Redirect de `/credits` | ⚠️ Sem link direto (OK) |
| O2 | `/payment/success` | PaymentSuccess | Redirect pós-pagamento | ⚠️ Sem link direto (OK) |
| O3 | `/payment/failure` | PaymentFailure | Redirect pós-pagamento | ⚠️ Sem link direto (OK) |
| O4 | `/admin/finance` | AdminFinance | AdminDashboard actions | ⚠️ Sem link no Sidebar Admin |
| O5 | `/admin/analytics` | AdminAnalytics | AdminDashboard actions | ⚠️ Sem link no Sidebar Admin |

**Observação:** O1, O2, O3 são intencionalmente órfãs (rotas de fluxo). O4 e O5 deveriam ter links no Sidebar Admin.

---

### 🟢 SUGESTÃO: Links que Deveriam Existir

| ID | Link Sugerido | Onde deveria estar | Destino | Motivo |
|----|---------------|-------------------|---------|---------|
| S1 | Ver Histórico de Pagamentos | Credits page | `/payments/history` | Transparência financeira |
| S2 | Gerenciar Calendário | TeacherDashboard | `/teaching/calendar` | Controle de disponibilidade |
| S3 | Minhas Aulas Agendadas | StudentDashboard | `/schedule` (filtrado) | Acesso rápido |
| S4 | Cancelar Aula | Schedule/Cards | - | Funcionalidade de cancelamento |
| S5 | Avaliar Professor | Pós-aula | - | Sistema de feedback |
| S6 | Histórico Completo | Profile | `/history` | Registro de atividades |
| S7 | Chat com Suporte | Header global | `/support` | Atendimento |

---

## 📊 TELAS FALTANTES SUGERIDAS

### Alta Prioridade

#### 1. `/admin/payments` - Histórico de Pagamentos Admin
**Status:** ❌ Não implementado
**Botão Existente:** Sim (Admin.tsx linha ~85)
**Descrição:** Visualização detalhada de todas as transações do sistema
**Funcionalidades:**
- Lista de todas as transações (créditos comprados)
- Filtros por data, usuário, status
- Gráficos de receita
- Export para CSV/PDF
- Detalhes de cada transação

**Componente:** `src/pages/AdminPayments.tsx`

---

### Média Prioridade

#### 2. `/admin/reports` - Relatórios do Sistema
**Status:** ❌ Não implementado
**Botão Existente:** Sim (Admin.tsx linha ~95)
**Descrição:** Relatórios customizáveis de uso, receita, engajamento
**Funcionalidades:**
- Relatórios pré-definidos (uso, receita, alunos ativos)
- Geração de relatórios customizados
- Agendamento de relatórios automáticos
- Export em múltiplos formatos

**Componente:** `src/pages/AdminReports.tsx`

---

#### 3. `/payments/history` - Histórico de Pagamentos do Usuário
**Status:** ❌ Não implementado
**Descrição:** Histórico pessoal de compras de créditos
**Funcionalidades:**
- Lista de compras anteriores
- Status de cada transação
- Recibos/invoices para download
- Gráfico de gastos ao longo do tempo

**Componente:** `src/pages/PaymentHistory.tsx`

---

#### 4. `/teaching/students` - Lista de Alunos (Professor)
**Status:** ⚠️ Parcialmente implementado (só modal)
**Descrição:** Página dedicada para professores verem todos os alunos
**Funcionalidades:**
- Lista completa com busca/filtros
- Cards com detalhes de cada aluno
- Histórico de aulas por aluno
- Notas e feedback
- Progresso individual

**Componente:** `src/pages/TeacherStudents.tsx`

---

### Baixa Prioridade

#### 5. `/student/history` - Histórico Completo do Aluno
**Status:** ⚠️ Parcialmente implementado (componente LessonHistory)
**Descrição:** Histórico detalhado de todas as atividades do aluno
**Funcionalidades:**
- Aulas passadas com detalhes
- Notas e feedback recebidos
- Conquistas e badges
- Certificados
- Gráficos de progresso

**Componente:** `src/pages/StudentHistory.tsx`

---

#### 6. `/materials` - Biblioteca de Materiais Didáticos
**Status:** ❌ Não implementado (mencionado em vários lugares)
**Descrição:** Repositório de materiais educacionais
**Funcionalidades:**
- Categorias: PDFs, Vídeos, Exercícios, Áudios
- Filtros por nível e tema
- Download/visualização inline
- Favoritos
- Upload de materiais (professores)

**Componente:** `src/pages/Materials.tsx`

---

#### 7. `/support` - Central de Suporte
**Status:** ❌ Não implementado
**Descrição:** FAQ, chat de suporte, tickets
**Funcionalidades:**
- FAQ categorizado
- Sistema de tickets
- Chat ao vivo (se disponível)
- Base de conhecimento
- Tutoriais em vídeo

**Componente:** `src/pages/Support.tsx`

---

## 🎯 PLANO DE IMPLEMENTAÇÃO

### Fase 1: Correções Críticas (Prioridade Alta)

#### 1.1 Criar Tela `/admin/payments`
```bash
- Criar: src/pages/AdminPayments.tsx
- Adicionar rota em App.tsx
- Funcionalidades: Lista de transações, filtros, detalhes
- Tempo estimado: 4-6 horas
```

#### 1.2 Criar Tela `/admin/reports`
```bash
- Criar: src/pages/AdminReports.tsx
- Adicionar rota em App.tsx
- Funcionalidades: Relatórios pré-definidos, export
- Tempo estimado: 6-8 horas
```

#### 1.3 Corrigir Navegação StudentDashboard
```bash
- Arquivo: src/pages/StudentDashboard.tsx
- Linha: ~30-35 (botão "Agendar Aula")
- Mudar: navigate('/catalog') → navigate('/schedule')
- Tempo estimado: 5 minutos
```

#### 1.4 Adicionar Links no Sidebar Admin
```bash
- Arquivo: src/components/Sidebar.tsx
- Adicionar links para /admin/finance e /admin/analytics
- Tempo estimado: 15 minutos
```

**Tempo Total Fase 1:** ~12-16 horas

---

### Fase 2: Melhorias Funcionais (Prioridade Média)

#### 2.1 Criar Tela `/payments/history`
```bash
- Criar: src/pages/PaymentHistory.tsx
- Adicionar rota em App.tsx
- Adicionar link em Credits.tsx
- Tempo estimado: 3-4 horas
```

#### 2.2 Criar Tela `/teaching/students`
```bash
- Criar: src/pages/TeacherStudents.tsx
- Adicionar rota em App.tsx
- Migrar lógica do modal atual
- Tempo estimado: 5-6 horas
```

#### 2.3 Remover Botões Duplicados
```bash
- AdminDashboard: Remover um dos botões "Configurações"
- TeacherDashboard: Consolidar links de perfil
- Tempo estimado: 30 minutos
```

**Tempo Total Fase 2:** ~9-11 horas

---

### Fase 3: Funcionalidades Novas (Prioridade Baixa)

#### 3.1 Criar Tela `/student/history`
```bash
- Criar: src/pages/StudentHistory.tsx
- Aproveitar componente LessonHistory existente
- Adicionar link no Profile ou Sidebar
- Tempo estimado: 4-5 horas
```

#### 3.2 Criar Tela `/materials`
```bash
- Criar: src/pages/Materials.tsx
- Sistema de categorias e filtros
- Upload/download de arquivos
- Tempo estimado: 10-12 horas
```

#### 3.3 Criar Tela `/support`
```bash
- Criar: src/pages/Support.tsx
- FAQ, tickets, base de conhecimento
- Tempo estimado: 8-10 horas
```

**Tempo Total Fase 3:** ~22-27 horas

---

### Resumo de Esforço

| Fase | Prioridade | Tarefas | Tempo Estimado |
|------|-----------|---------|----------------|
| Fase 1 | Alta | 4 correções críticas | 12-16 horas |
| Fase 2 | Média | 3 melhorias | 9-11 horas |
| Fase 3 | Baixa | 3 novas funcionalidades | 22-27 horas |
| **TOTAL** | - | **10 tarefas** | **43-54 horas** |

---

## 📈 MÉTRICAS RESUMIDAS

```json
{
  "rotas_definidas": 25,
  "rotas_funcionais": 23,
  "rotas_faltantes": 2,
  "rotas_orfas": 5,
  "botoes_mapeados": 57,
  "problemas_criticos": 2,
  "problemas_medios": 3,
  "sugestoes_melhorias": 7,
  "telas_a_criar": 7,
  "tempo_total_estimado": "43-54 horas"
}
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

### Rotas
- [ ] Todas as rotas definidas têm componentes implementados
- [ ] Todas as rotas têm pelo menos um link de acesso (exceto rotas de fluxo)
- [ ] Não existem botões apontando para rotas inexistentes
- [ ] Proteções de rota estão corretas (public, authenticated, role-based)

### Navegação
- [ ] Sidebar tem links para todas as rotas principais
- [ ] Dashboards têm navegação consistente por role
- [ ] Não existem links duplicados desnecessários
- [ ] Links de "Voltar" funcionam corretamente

### Experiência do Usuário
- [ ] Fluxos de navegação são intuitivos
- [ ] Não há caminhos sem saída (dead ends)
- [ ] Breadcrumbs estão presentes onde necessário
- [ ] Mensagens de erro para rotas 404 são claras

---

**Documento gerado em:** 04/10/2025
**Autor:** Claude Code Assistant
**Próxima revisão:** Após implementação da Fase 1

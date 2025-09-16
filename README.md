# 🎯 Escola Inglês Pareto - Plataforma de Ensino

Uma plataforma completa de ensino de inglês com agendamento integrado ao Google Calendar, sistema de créditos flexível, fórum da comunidade e assistente IA conversacional.

## 🚀 Status do Projeto
- ✅ **8 Fases Implementadas** - Aplicação funcional completa
- 🔄 **Fase de Manutenção** - Resolução gradual de débitos técnicos
- 🛡️ **Estável em Produção** - Ready for deployment
- 🎨 **Design Profissional** - Interface responsiva azul-cyan

## 🛠️ Stack Tecnológica
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Integrações**: Google Calendar API + OAuth2
- **AI**: Chat integrado com modos de conversação
- **Estado**: TanStack Query + React Hooks
- **Roteamento**: React Router v6

## 📋 Funcionalidades Principais

### 1. 🎓 Sistema de Aulas Estruturado
- **5 tipos de aula**: Grupo Iniciante/Intermediário/Avançado, Conversação Aberta, Individual
- **7 temas universais**: Relacionamentos, Trabalho, Vida Urbana, Saúde, Viagem, Tecnologia, Entretenimento
- **20 tópicos de conversação** com foco gramatical específico
- **Templates pré-definidos** - professores apenas preenchem, não criam do zero

### 2. 💳 Sistema de Créditos Flexível
- **Grupo**: 1 crédito por aula
- **Individual**: 3 créditos por aula
- **4 pacotes**: Iniciante (12), Padrão (30), Premium (65), Individual (18)
- **Gestão completa**: histórico, transações, verificação automática

### 3. 📅 Google Calendar Integrado
- **Calendário único**: "Aulas Inglês Pareto"
- **Cores por tipo**: Verde (iniciante), Azul (intermediário), Roxo (avançado)
- **Google Meet**: Links automáticos para cada aula
- **Sincronização real**: OAuth2 + API completa

### 4. 🏛️ Fórum da Comunidade
- **5 categorias**: Grammar, Vocabulary, Conversation, Culture, Homework
- **Sistema social**: Upvotes, badges, reputação
- **Moderação**: Professores marcam respostas como solução
- **Busca avançada**: Por título, conteúdo, tags

### 5. 🤖 AI Chat Conversacional
- **5 modos**: Daily Conversation, Grammar Practice, Business, IELTS Prep, Free Talk
- **Texto + Voz**: Speech-to-text e Text-to-speech
- **Correção gramatical**: Feedback em tempo real
- **Histórico completo**: Conversas salvas por sessão

### 6. 🎯 Trilhas de Aprendizado
- **Beginner Foundation**: 40h estruturadas
- **Intermediate Conversation**: 60h de prática
- **Advanced Business**: 50h especializadas
- **Sistema de progresso**: Conquistas, badges, tracking detalhado

## 🏗️ Arquitetura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Layout principal
│   ├── Header.tsx      # Header com busca e menu
│   └── Sidebar.tsx     # Navegação lateral
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Página inicial
│   ├── ClassCatalog.tsx # Catálogo de aulas
│   ├── Schedule.tsx    # Agendamentos
│   ├── Credits.tsx     # Gestão de créditos
│   ├── Forum.tsx       # Fórum da comunidade
│   ├── AIChat.tsx      # Chat com IA
│   └── Learning.tsx    # Trilhas de aprendizado
├── hooks/              # Custom hooks
│   ├── useCredits.ts   # Gestão de créditos
│   └── useBookings.ts  # Agendamentos
├── services/           # APIs e integrações
│   ├── supabase.ts     # Cliente Supabase
│   └── google-calendar.ts # Google Calendar API
├── types/              # Definições TypeScript
├── data/               # Mock data e constantes
└── utils/              # Funções utilitárias
```

## ⚙️ Setup e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase
- Google Cloud Project com Calendar API

### Instalação
```bash
# Clone o repositório
git clone [URL_DO_REPO]
cd escola-ingles-pareto-app

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Preencher com suas credenciais:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_GOOGLE_CLIENT_ID
# - VITE_GOOGLE_CLIENT_SECRET

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:8081

### Scripts Disponíveis
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar linting
npm run type-check   # Verificar TypeScript
npm run test         # Executar testes
```

## 📊 Débitos Técnicos e Política de Manutenção

Ver `DEBITOS_TECNICOS.md` para lista completa e estratégia de resolução.

### 🛡️ Filosofia de Manutenção
> **"Não quebrar o que funciona"**

### Classificação de Mudanças:
- 🟢 **Resolver**: Bugs e funcionalidades incompletas
- 🟡 **Avaliar**: Melhorias que não afetam estabilidade
- 🔴 **Não mexer**: Code smells em componentes funcionais

### Arquivos Protegidos:
- `src/components/ui/sidebar.tsx` - Navegação crítica (23KB mas funcional)
- `src/App-backup.tsx` - Backup de segurança essencial
- Dependências principais - Stack estável

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie uma branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

### Convenções de Commit
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `refactor:` Refatoração sem mudança de comportamento
- `docs:` Atualizações de documentação
- `test:` Adição ou correção de testes
- `chore:` Manutenção geral

## 📄 Documentação Adicional

- `PROJETO_ANALISE_15_SET_2024.md` - Análise completa do projeto e roadmap
- `DEBITOS_TECNICOS.md` - Lista de débitos técnicos e estratégia
- `CONTRIBUTING.md` - Guia detalhado de contribuição
- `AI_RULES.md` - Regras específicas para desenvolvimento com IA

## 🎉 Marcos do Projeto

- **15/09/2024** - Projeto iniciado
- **15/09/2024** - Fases 1-4 implementadas (Layout + Templates + Créditos + Calendar)
- **15/09/2024** - Fases 5-6 implementadas (Forum + AI Chat)
- **16/09/2024** - Fases 7-8 implementadas (Learning + Integração Real)
- **16/09/2024** - 🎯 **Projeto Concluído** - Todas as 8 fases funcionais

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para democratizar o ensino de inglês**

*Projeto criado com Claude Code Assistant - Setembro 2024*
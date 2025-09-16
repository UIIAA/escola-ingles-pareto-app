# 🤝 Guia de Contribuição - Escola Inglês Pareto

## 🛡️ Filosofia de Contribuição

> **"Melhor código funcionando imperfeito que código perfeito quebrado"**

Este projeto segue o princípio de **estabilidade primeiro**. Toda mudança deve ser justificada por benefício real aos usuários, não apenas "código mais limpo".

## 📊 **POLÍTICA DE DÉBITOS TÉCNICOS**

Antes de fazer qualquer mudança, consulte `DEBITOS_TECNICOS.md` e classifique sua contribuição:

### ✅ **SEMPRE BEM-VINDAS (Baixo Risco)**
- 🐛 **Correção de bugs** que afetam usuários
- ✨ **Novas funcionalidades** testadas e documentadas
- 📝 **Melhorias de documentação**
- 🧪 **Adição de testes**
- 🎨 **Melhorias de UX** sem quebrar funcionalidade existente

### 🟡 **AVALIAR CUIDADOSAMENTE (Médio Risco)**
- 🔧 **Refatorações** de componentes funcionais
- ⬆️ **Updates de dependências** não críticas
- 🎯 **Otimizações de performance** em código funcionando
- 📱 **Mudanças de layout** em componentes estáveis

### ❌ **REQUER APROVAÇÃO ESPECIAL (Alto Risco)**
- 🏗️ **Refatoração massiva** de componentes grandes funcionais
- 📦 **Updates de dependências principais** (React, TypeScript, etc)
- 🗑️ **Remoção de arquivos** que podem ser backups
- 🔄 **Mudanças arquiteturais** significativas

## 🚨 **ARQUIVOS PROTEGIDOS**

### ❌ **NÃO MEXER SEM APROVAÇÃO**
```
src/components/ui/sidebar.tsx    # Navegação crítica (23KB mas funcional)
src/App-backup.tsx              # Backup de segurança essencial
package.json                    # Dependências estáveis
```

### ⚠️ **MEXER COM EXTREMO CUIDADO**
```
src/components/Header.tsx       # Componente central
src/App.tsx                     # Roteamento principal
src/services/google-calendar.ts # Integração funcionando
```

## 📋 **PROCESSO DE CONTRIBUIÇÃO**

### **1. Análise de Risco**
Antes de começar, analise:
- ✅ **Benefício real** para usuários?
- ⚠️ **Risco de quebrar** funcionalidade existente?
- 🧪 **Pode ser testado** adequadamente?
- 📖 **Está documentado** no issue/PR?

### **2. Preparação do Ambiente**

```bash
# Clone do projeto
git clone [URL_DO_REPO]
cd escola-ingles-pareto-app

# Instalação
npm install

# Configurar ambiente
cp .env.example .env
# Preencher credenciais necessárias

# Verificar se tudo funciona
npm run dev
npm run lint
npm run type-check
```

### **3. Desenvolvimento**

#### **Para Mudanças de BAIXO RISCO (✅):**
```bash
# Branch opcional mas recomendada
git checkout -b fix/nome-do-bug

# Desenvolvimento
# ... fazer mudanças ...

# Testes básicos
npm run dev  # Verificar se funciona
npm run lint # Verificar linting
npm run type-check # Verificar TypeScript

# Commit direto aceitável
git add .
git commit -m "fix: corrige bug do modal de detalhes"
git push origin fix/nome-do-bug
```

#### **Para Mudanças de MÉDIO RISCO (🟡):**
```bash
# Branch OBRIGATÓRIA
git checkout -b feature/nova-funcionalidade

# Desenvolvimento com testes extensivos
# ... implementar ...

# Testes completos
npm run dev      # Testar todas as páginas
npm run build    # Verificar se builda
npm run preview  # Testar build

# Testar funcionalidades relacionadas
# Navegação, forms, integrações, etc.

# Commit com descrição detalhada
git add .
git commit -m "feat: implementa busca global no header

- Adiciona estado de busca global
- Integra com todas as páginas
- Mantém histórico de buscas
- Testes em todas as rotas principais"

git push origin feature/nova-funcionalidade
```

#### **Para Mudanças de ALTO RISCO (❌):**
```bash
# Discussão prévia OBRIGATÓRIA via issue
# Branch especial
git checkout -b high-risk/refactor-sidebar

# Backup antes de começar
git tag backup-before-refactor
cp -r src src_backup_$(date +%Y%m%d)

# Desenvolvimento incremental
# ... pequenas mudanças por vez ...

# Testes exaustivos
npm run dev      # Todas as funcionalidades
npm run build    # Build de produção
npm run test     # Suite de testes
# Teste manual de TODAS as páginas
# Teste de integração completo

# Documentação obrigatória
# ... atualizar README, docs, etc ...

# Commit muito detalhado
git add .
git commit -m "refactor: quebra sidebar em componentes menores

BREAKING CHANGES:
- Sidebar.tsx dividido em 5 arquivos
- Mantém mesma API externa
- Performance melhorada em 15%

TESTES REALIZADOS:
✅ Navegação completa testada
✅ Responsive design funcional
✅ Estados ativos mantidos
✅ Animações preservadas

ROLLBACK PLAN:
- Reverter para backup-before-refactor
- Ou usar App-backup.tsx se necessário"

git push origin high-risk/refactor-sidebar
```

### **4. Pull Request**

#### **Template de PR**
```markdown
## 📋 Resumo
<!-- Descrever brevemente o que foi alterado -->

## 🎯 Tipo de Mudança
- [ ] 🐛 Bug fix (mudança que corrige um problema)
- [ ] ✨ Nova funcionalidade (mudança que adiciona funcionalidade)
- [ ] 💥 Breaking change (mudança que quebra compatibilidade)
- [ ] 📝 Documentação (mudanças apenas na documentação)
- [ ] 🎨 Estilo (formatação, ponto e vírgula, etc)
- [ ] 🔧 Refatoração (mudança de código que não corrige bug nem adiciona feature)

## 🧪 Checklist de Testes
- [ ] 🖥️ Testado no desktop
- [ ] 📱 Testado no mobile
- [ ] 🔄 Todas as rotas navegáveis
- [ ] ⚙️ `npm run dev` funcionando
- [ ] 🏗️ `npm run build` sem erros
- [ ] 📏 `npm run lint` ok
- [ ] 🎯 `npm run type-check` ok

## 📊 Análise de Risco
### Nível de Risco: 🟢 Baixo / 🟡 Médio / 🔴 Alto

### Justificativa:
<!-- Por que essa mudança vale o risco? -->

### Plano de Rollback:
<!-- Como reverter se algo der errado? -->

## 🔍 Como Testar
1. <!-- Passo a passo para revisar a mudança -->

## 📸 Screenshots (se aplicável)
<!-- Antes e depois, principalmente para mudanças visuais -->

## 📝 Documentação
- [ ] README atualizado se necessário
- [ ] Comentários no código adicionados
- [ ] DEBITOS_TECNICOS.md atualizado se necessário
```

## 🎯 **CONVENÇÕES DE CÓDIGO**

### **Commits**
```bash
# Formato: tipo(escopo): descrição
feat(sidebar): adiciona ícone de notificações
fix(calendar): corrige bug de timezone
docs(readme): atualiza instruções de setup
refactor(hooks): melhora performance do useCredits
test(forum): adiciona testes de criação de tópico
chore(deps): atualiza dependências de desenvolvimento
```

### **Branches**
```bash
# Funcionalidades
feature/nome-da-feature
feature/search-functionality
feature/voice-chat

# Bug fixes
fix/nome-do-bug
fix/calendar-timezone
fix/modal-overflow

# Documentação
docs/nome-da-doc
docs/contributing-guide
docs/api-documentation

# Alto risco (requer discussão prévia)
high-risk/nome-da-mudanca
high-risk/sidebar-refactor
high-risk/dependency-update
```

### **TypeScript**
- ✅ **Sempre tipado** - Nada de `any`
- ✅ **Interfaces descritivas** - Nomes claros
- ✅ **Exportações explícitas** - Não usar `export default` quando possível
- ✅ **Comentários TSDoc** para funções complexas

### **React**
- ✅ **Functional components** sempre
- ✅ **Hooks** ao invés de class components
- ✅ **Props interface** para todos os componentes
- ✅ **Error boundaries** quando apropriado

### **Estilo**
- ✅ **Tailwind CSS** para estilização
- ✅ **shadcn/ui** para componentes base
- ✅ **Paleta consistente** - azul-cyan gradient
- ✅ **Responsive first** - mobile → desktop

## 🧪 **TESTES**

### **Testes Manuais (Obrigatórios)**
```bash
# Lista de verificação básica
1. ✅ npm run dev - servidor inicia
2. ✅ http://localhost:8081 - página carrega
3. ✅ Navegação sidebar - todas as rotas funcionam
4. ✅ Header - busca, menu, notificações
5. ✅ Forms - agendamento, fórum, perfil
6. ✅ Mobile - layout responsivo
7. ✅ Console - sem erros JavaScript
8. ✅ Network - requests sem falhas
```

### **Testes Automatizados (Desejável)**
```bash
# Quando tiver suite de testes
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
npm run test:coverage # Coverage report
```

## 🚀 **DEPLOY E PRODUÇÃO**

### **Checklist Pré-Deploy**
- ✅ **Build produção** funciona
- ✅ **Variáveis ambiente** configuradas
- ✅ **Performance** testada
- ✅ **Lighthouse score** >90
- ✅ **Cross-browser** testado
- ✅ **Rollback plan** definido

### **Monitoramento Pós-Deploy**
- 📊 **Analytics** - comportamento usuários
- 🐛 **Error tracking** - bugs em produção
- ⚡ **Performance** - tempos de carregamento
- 📈 **Usage metrics** - features utilizadas

## ❓ **DÚVIDAS E SUPORTE**

### **Antes de Contribuir**
1. 📖 **Leia** este guia completamente
2. 🔍 **Verifique** issues existentes
3. 💬 **Discuta** mudanças grandes via issue
4. 📝 **Documente** sua proposta

### **Durante o Desenvolvimento**
- 💬 **Comunique** bloqueios e dificuldades
- 🧪 **Teste** incrementalmente
- 📖 **Documente** decisões técnicas
- 🤝 **Collaborate** - peça ajuda quando necessário

### **Canais de Comunicação**
- 📋 **GitHub Issues** - bugs e features
- 🔄 **Pull Requests** - code review
- 📧 **Email** - questões privadas
- 💬 **Discussions** - dúvidas gerais

---

## 🙏 **Agradecimentos**

Obrigado por contribuir para democratizar o ensino de inglês!

Sua contribuição, por menor que seja, faz diferença na vida de estudantes ao redor do mundo.

**Lembre-se:** Estabilidade > Perfeição. Funcionalidade > Beleza do código.

---

*📅 Guia atualizado em: Setembro 2024*
*🔄 Mantido por: Comunidade Escola Inglês Pareto*
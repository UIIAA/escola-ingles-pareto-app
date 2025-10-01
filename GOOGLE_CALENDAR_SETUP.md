# 📅 Guia Completo - Vincular Google Calendar

## ✅ Status Atual

O código está **100% pronto** para Google Calendar. Você só precisa:
1. Habilitar a API no Google Cloud
2. Fazer login na aplicação

---

## 🔧 PASSO 1: Verificar Credenciais

As seguintes variáveis já devem estar no Vercel:

```bash
VITE_GOOGLE_API_KEY=sua_chave_aqui
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui
VITE_GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
```

✅ Você disse que já configurou no Vercel - PERFEITO!

---

## 🔧 PASSO 2: Habilitar Google Calendar API

### 2.1 Acesse o Google Cloud Console
```
https://console.cloud.google.com/
```

### 2.2 Selecione seu Projeto
- Procure por "Escola Inglês Pareto" ou o nome do seu projeto
- Se não tiver projeto, clique em "Novo Projeto"

### 2.3 Habilitar APIs
1. Menu lateral → **APIs e Serviços** → **Biblioteca**
2. Busque: **Google Calendar API**
3. Clique em **ATIVAR**

### 2.4 Configurar Tela de Consentimento OAuth (se ainda não fez)
1. Menu → **APIs e Serviços** → **Tela de consentimento OAuth**
2. Escolha: **Externo** (para permitir qualquer conta Google)
3. Preencha:
   - Nome do app: **Escola Inglês Pareto**
   - Email de suporte: seu email
   - Domínio: seu domínio Vercel
4. Escopos necessários:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
5. Salvar

### 2.5 Adicionar Domínios Autorizados
1. Menu → **APIs e Serviços** → **Credenciais**
2. Clique nas suas credenciais OAuth 2.0
3. Em **Origens JavaScript autorizadas**, adicione:
   ```
   http://localhost:5173
   https://seu-dominio.vercel.app
   ```
4. Em **URIs de redirecionamento autorizados**, adicione:
   ```
   http://localhost:5173
   https://seu-dominio.vercel.app
   ```
5. Salvar

---

## 🧪 PASSO 3: Testar Localmente

### 3.1 Adicionar Variáveis no .env Local
Crie arquivo `.env` na raiz do projeto:

```bash
# .env
VITE_GOOGLE_API_KEY=sua_chave_real
VITE_GOOGLE_CLIENT_ID=seu_client_id_real
VITE_GOOGLE_CLIENT_SECRET=seu_client_secret_real
```

### 3.2 Rodar Aplicação
```bash
npm run dev
```

### 3.3 Abrir no Navegador
```
http://localhost:5173
```

### 3.4 Fazer Login
1. Login com: `testeprofessor@inglespareto.com.br`
2. Ir para: **Agendamento** (`/schedule`)
3. Você verá uma mensagem ou botão para **conectar Google Calendar**

### 3.5 Autorizar Google Calendar
1. Clique em "Conectar Google Calendar" (se aparecer)
2. Selecione sua conta Google
3. Clique em **Permitir** todas as permissões
4. Pronto! 🎉

---

## 🎯 PASSO 4: Como Funciona

### Ao Agendar uma Aula:

1. **Você seleciona data e hora** no calendário
2. **Sistema verifica disponibilidade** via Google Calendar
3. **Cria evento** no calendário "Aulas Inglês Pareto"
4. **Envia convites** para professor e aluno(s)
5. **Adiciona link Google Meet** automaticamente

### O que é criado:

```
📅 Calendário: "Aulas Inglês Pareto"
📍 Evento: "Aula de [Tipo] - [Tópico]"
👥 Participantes: Professor + Aluno(s)
🔗 Link: Google Meet gerado automaticamente
⏰ Horário: Horário selecionado
🏷️ Cor: Por tipo de aula (Iniciante=Verde, Intermediário=Azul, etc)
```

---

## 🔍 PASSO 5: Verificar se Está Funcionando

### No Console do Navegador (F12):

Você deve ver:
```
✅ Verificando credenciais Google Calendar:
  - API Key: ✅
  - Client ID: ✅
  - Client Secret: ✅
✅ Google Calendar Service inicializado
✅ Calendário "Aulas Inglês Pareto" criado
```

### No Google Calendar:

1. Acesse: https://calendar.google.com
2. Você deve ver um novo calendário: **"Aulas Inglês Pareto"**
3. As aulas agendadas aparecerão lá

---

## ❌ Troubleshooting

### Erro: "API não habilitada"
**Solução:** Volte ao Passo 2.3 e habilite Google Calendar API

### Erro: "Origem não autorizada"
**Solução:** Adicione seu domínio no Passo 2.5

### Erro: "Credenciais inválidas"
**Solução:** Verifique se as variáveis de ambiente estão corretas

### Não aparece botão "Conectar Calendar"
**Solução:** O sistema tenta conectar automaticamente. Verifique o console (F12)

### Eventos não aparecem no Google Calendar
**Solução:**
1. Verifique se o calendário "Aulas Inglês Pareto" está visível
2. Recarregue a página do Google Calendar

---

## 🔐 Segurança

### ✅ O que o sistema FAZ:
- Cria eventos no calendário específico "Aulas Inglês Pareto"
- Verifica disponibilidade de horários
- Envia convites para participantes
- Cria links Google Meet

### ❌ O que o sistema NÃO FAZ:
- Não acessa calendários pessoais
- Não deleta eventos de outros calendários
- Não compartilha informações privadas
- Não tem acesso a emails ou Drive

---

## 📊 Funcionalidades Ativas

### ✅ Implementado:
- [x] Verificação de disponibilidade
- [x] Criação de eventos
- [x] Calendário único "Aulas Inglês Pareto"
- [x] Cores por tipo de aula
- [x] Convites automáticos
- [x] Integração com Google Meet
- [x] Timezone Brasil (America/Sao_Paulo)
- [x] Mock para testes sem API

### ⏳ Para Ativar (após configurar):
- [ ] Login Google OAuth
- [ ] Sincronização em tempo real
- [ ] Notificações push

---

## 🎬 Fluxo Completo

```mermaid
1. Usuário abre /schedule
   ↓
2. Sistema verifica credenciais Google
   ↓
3. Se configurado → inicia OAuth
   ↓
4. Usuário autoriza permissões
   ↓
5. Sistema busca/cria calendário "Aulas Inglês Pareto"
   ↓
6. Usuário seleciona data/hora
   ↓
7. Sistema verifica disponibilidade no Google Calendar
   ↓
8. Usuário confirma agendamento
   ↓
9. Sistema cria evento com:
   - Título da aula
   - Professor e aluno(s)
   - Link Google Meet
   - Cor por tipo
   ↓
10. ✅ Evento aparece no Google Calendar
```

---

## 🆘 Precisa de Ajuda?

### Logs para Verificar:

Abra console (F12) e procure por:
- `🔍 Verificando credenciais Google Calendar`
- `Inicializando Google Calendar Service`
- `Google Calendar Service inicializado`
- `Autenticação Google Calendar realizada`
- `Calendário "Aulas Inglês Pareto" criado`

### Teste Rápido (5 min):

1. ✅ Variáveis no Vercel configuradas?
2. ✅ Google Calendar API habilitada?
3. ✅ Domínios autorizados adicionados?
4. ✅ Login na aplicação feito?
5. ✅ Ir para /schedule
6. ✅ Console mostra credenciais ✅?

Se todos ✅ = **FUNCIONANDO!** 🎉

---

## 📝 Resumo Rápido

**O que você precisa fazer AGORA:**

1. **Google Cloud Console:**
   - Habilitar Google Calendar API ✅
   - Adicionar domínios autorizados ✅

2. **Na Aplicação:**
   - Fazer login
   - Ir para /schedule
   - Autorizar Google Calendar (popup)

3. **Testar:**
   - Agendar uma aula
   - Verificar no Google Calendar

**Tempo estimado:** 10-15 minutos

---

**Criado em:** 01 de Outubro de 2025
**Última atualização:** Commit d7673dc
**Status:** ✅ Código pronto, aguardando configuração Google Cloud

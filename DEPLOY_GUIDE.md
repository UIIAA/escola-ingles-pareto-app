# 🚀 Guia de Deploy - Escola Inglês Pareto

## ✅ Pré-requisitos

- [x] Build local passou sem erros ✅
- [x] Todos commits pushed para `main` ✅
- [x] Variáveis de ambiente documentadas ✅
- [x] Configuração `vercel.json` existe ✅

---

## 📋 PASSO A PASSO - DEPLOY VERCEL

### 1. Login no Vercel (Manual - Requer Navegador)

```bash
vercel login
```

Isso abrirá uma janela do navegador para autenticação. Siga os passos:
1. Selecione método de login (GitHub, GitLab, Email)
2. Autorize o Vercel CLI
3. Aguarde confirmação no terminal

---

### 2. Configurar Variáveis de Ambiente

**Opção A: Via Dashboard (Recomendado)**

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto ou clique em "Add New Project"
3. Vá em: Settings → Environment Variables
4. Adicione as seguintes variáveis:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://agbrdfuelvvqbvcytqvc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnYnJkZnVlbHZ2cWJ2Y3l0cXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY1MTU4MzgsImV4cCI6MjA0MjA5MTgzOH0.oTYg3DPtQp8sPlk8kWQFGjH_Hc-h4hl1WDiLQKvOVLM

# Google APIs
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Google Gemini AI (CRÍTICO para Chat IA)
VITE_GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Environment
NODE_ENV=production
```

**Opção B: Via CLI**

```bash
# Definir variáveis uma por uma
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_GOOGLE_API_KEY
vercel env add VITE_GOOGLE_CLIENT_ID
vercel env add VITE_GOOGLE_CLIENT_SECRET
vercel env add VITE_GOOGLE_GEMINI_API_KEY
vercel env add NODE_ENV
```

---

### 3. Deploy para Produção

**Primeiro Deploy:**
```bash
# Se nunca fez deploy antes
vercel

# Responda as perguntas:
# ? Set up and deploy "...escola-ingles-pareto-app"? [Y/n] y
# ? Which scope do you want to deploy to? [selecione seu usuário]
# ? Link to existing project? [N/y] n
# ? What's your project's name? escola-ingles-pareto
# ? In which directory is your code located? ./
```

**Deploy Subsequente:**
```bash
# Deploy para produção
vercel --prod

# OU deploy com confirmação automática
vercel --prod --yes
```

---

### 4. Verificar Deploy

Após o deploy, o Vercel fornecerá:
- ✅ URL de preview: `https://escola-ingles-pareto-[hash].vercel.app`
- ✅ URL de produção: `https://escola-ingles-pareto.vercel.app`

Acesse a URL e verifique:
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Chat IA funciona (modo demo ou real)
- [ ] Agendamento funciona
- [ ] Fórum carrega
- [ ] Upload de vídeos funciona

---

## 🔧 Troubleshooting

### Erro: "Missing environment variables"
**Solução:** Configure todas as variáveis no dashboard Vercel antes do deploy.

### Erro: "Build failed"
**Solução:**
```bash
# Limpar cache e tentar novamente
rm -rf dist node_modules
npm install
npm run build
vercel --prod --force
```

### Erro: "Module not found"
**Solução:**
```bash
# Reinstalar dependências
npm ci
vercel --prod
```

### Páginas retornam 404
**Solução:** O arquivo `vercel.json` já está configurado corretamente com rewrites. Se ainda houver problemas, verifique se o arquivo existe na raiz do projeto.

### Chat IA não funciona
**Solução:** Verifique se `VITE_GOOGLE_GEMINI_API_KEY` está configurada corretamente no Vercel Dashboard.

---

## 📊 Monitoramento Pós-Deploy

### 1. Logs em Tempo Real
```bash
vercel logs [deployment-url]
```

### 2. Analytics
Acesse: https://vercel.com/[seu-usuario]/escola-ingles-pareto/analytics

### 3. Performance
Verifique métricas:
- Tempo de carregamento
- Core Web Vitals
- Bundle size

---

## 🔄 Redeploy Após Mudanças

Sempre que fizer commits no repositório:

```bash
# 1. Fazer mudanças no código
# 2. Commit e push
git add .
git commit -m "Suas mudanças"
git push origin main

# 3. Deploy
vercel --prod --yes
```

**OU configure deploy automático:**
1. Vá em: Settings → Git
2. Conecte o repositório GitHub
3. Ative "Automatic deployments from Git"
4. Cada push para `main` fará deploy automaticamente

---

## ⚙️ Configurações Avançadas

### Build Settings (se necessário ajustar)

No Vercel Dashboard → Settings → Build & Development Settings:

```bash
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Custom Domain (Opcional)

1. Vá em: Settings → Domains
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções
4. Aguarde propagação (até 48h)

---

## 📝 Checklist Final

### Antes do Deploy:
- [x] Build local passou ✅
- [x] Commits pushed ✅
- [x] Variáveis documentadas ✅
- [ ] Login no Vercel CLI
- [ ] Variáveis configuradas no dashboard

### Após o Deploy:
- [ ] URL de produção acessível
- [ ] Login funcionando
- [ ] Dashboard carrega
- [ ] Chat IA operacional
- [ ] Agendamento funciona
- [ ] Fórum acessível
- [ ] Não há erros no console

### Testes Essenciais:
- [ ] Testar com testeprofessor@inglespareto.com.br
- [ ] Criar novo tópico no fórum
- [ ] Agendar uma aula
- [ ] Usar Chat IA (modo demo)
- [ ] Fazer upload de vídeo
- [ ] Buscar conteúdo

---

## 🆘 Suporte

**Documentação Vercel:** https://vercel.com/docs
**Status Vercel:** https://www.vercel-status.com/
**Supabase Status:** https://status.supabase.com/

**Documentos do Projeto:**
- `RESUMO_FINAL_SESSAO_30_SET_2025.md`
- `CORRECOES_FINALIZADAS_30_SET_2025.md`
- `FORUM_SETUP_INSTRUCTIONS.md`

---

## 🎯 Estimativa de Tempo

- Login Vercel: 2 min
- Configurar variáveis: 5 min
- Primeiro deploy: 3-5 min
- Testes básicos: 10 min
- **Total:** ~20 minutos

---

**Criado em:** 30 de Setembro de 2025
**Status:** Pronto para deploy
**Build:** ✅ Passou sem erros

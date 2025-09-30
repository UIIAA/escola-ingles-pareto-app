# 📋 Instruções de Configuração do Fórum

## 🎯 Status Atual

✅ **Código Implementado:**
- ForumService completo (`src/services/forum.ts`)
- Migration SQL pronta (`migrations/001_forum_schema.sql`)
- Interface Frontend funcionando com dados mock

⏳ **Pendente:**
- Executar migration SQL no Supabase Dashboard
- Ativar integração com backend real

---

## 🚀 Como Executar a Migration

### Opção 1: Supabase SQL Editor (Recomendado)

1. **Acesse o Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/agbrdfuelvvqbvcytqvc/sql
   ```

2. **Copie o SQL da migration:**
   - Abra o arquivo: `migrations/001_forum_schema.sql`
   - Copie **todo** o conteúdo

3. **Execute no SQL Editor:**
   - Cole o código no editor SQL
   - Clique em "Run" para executar
   - Aguarde a confirmação de sucesso

4. **Verifique as tabelas criadas:**
   - Acesse: Database > Tables
   - Você deverá ver:
     - `forum_topics`
     - `forum_replies`
     - `forum_votes`

---

## 📦 O que a Migration Cria

### Tabelas:
1. **forum_topics** - Tópicos do fórum
2. **forum_replies** - Respostas aos tópicos
3. **forum_votes** - Sistema de votação (upvote/downvote)

### Tipos Enum:
- `forum_category_enum`: grammar, vocabulary, conversation, culture, homework
- `topic_status_enum`: open, closed, pinned, resolved
- `vote_enum`: up, down

### Triggers Automáticos:
- **Contador de respostas:** Atualiza `replies_count` automaticamente
- **Contador de votos:** Atualiza `upvotes` e `downvotes` automaticamente
- **Timestamps:** Atualiza `updated_at` em modificações

### RLS Policies (Segurança):
- ✅ Todos usuários autenticados podem **ler** tópicos e respostas
- ✅ Usuários podem **criar** seus próprios tópicos e respostas
- ✅ Usuários podem **editar/deletar** apenas seus próprios conteúdos
- ✅ Usuários podem **votar** e gerenciar seus próprios votos

---

## 🔌 Ativar Integração com Backend

Depois de executar a migration, ative o código no `Forum.tsx`:

### 1. Importar ForumService:
```typescript
import { ForumService } from '@/services/forum';
```

### 2. Substituir dados mock por dados reais:

**Estado inicial:**
```typescript
const [topics, setTopics] = useState<ForumTopic[]>([]);
const [loading, setLoading] = useState(true);
```

**Carregar tópicos:**
```typescript
useEffect(() => {
  const loadTopics = async () => {
    setLoading(true);
    const { data, error } = await ForumService.getTopics({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      sortBy: 'created_at',
      sortOrder: 'desc',
      userId: user?.id
    });

    if (!error && data) {
      setTopics(data);
    }
    setLoading(false);
  };

  loadTopics();
}, [selectedCategory, user]);
```

**Criar novo tópico:**
```typescript
const handleCreateTopic = async () => {
  const { data, error } = await ForumService.createTopic({
    title: newTopicTitle,
    content: newTopicContent,
    category: newTopicCategory,
    author_id: user!.id,
    tags: []
  });

  if (!error && data) {
    toast({
      title: "Tópico criado com sucesso!",
      description: "Seu tópico foi publicado no fórum."
    });
    // Recarregar tópicos
  }
};
```

**Criar resposta:**
```typescript
const handleReplySubmit = async () => {
  const { data, error } = await ForumService.createReply({
    content: replyContent,
    topic_id: selectedTopic!.id,
    author_id: user!.id
  });

  if (!error && data) {
    toast({
      title: "Resposta publicada!",
      description: "Sua resposta foi adicionada ao tópico."
    });
    // Recarregar tópico
  }
};
```

**Votar:**
```typescript
const handleVoteTopic = async (topicId: string, voteType: 'up' | 'down') => {
  const { data, error } = await ForumService.vote({
    user_id: user!.id,
    topic_id: topicId,
    vote_type: voteType
  });

  if (!error) {
    toast({
      title: voteType === 'up' ? "👍 Upvote registrado" : "👎 Downvote registrado"
    });
    // Recarregar tópicos
  }
};
```

---

## 🧪 Testar o Sistema

### 1. Criar Tópico de Teste:
```sql
INSERT INTO forum_topics (title, content, category, author_id, tags)
VALUES (
  'Teste do Sistema de Fórum',
  'Este é um tópico de teste para validar o funcionamento do sistema.',
  'grammar',
  (SELECT id FROM auth.users WHERE email = 'testeprofessor@inglespareto.com.br'),
  ARRAY['teste', 'validação']
);
```

### 2. Verificar se Aparece no Frontend:
- Acesse a página do Fórum
- O tópico deve aparecer listado
- Teste criar uma resposta
- Teste o sistema de votação

---

## 📊 Funcionalidades Implementadas

### ✅ Backend (ForumService):
- [x] Listar tópicos com paginação e filtros
- [x] Buscar tópico individual com respostas
- [x] Criar novo tópico
- [x] Atualizar tópico
- [x] Deletar tópico
- [x] Criar resposta
- [x] Atualizar resposta
- [x] Deletar resposta
- [x] Sistema de votação (upvote/downvote)
- [x] Remover voto
- [x] Estatísticas do fórum
- [x] Busca de tópicos
- [x] Real-time updates (subscriptions)

### ✅ Frontend (Forum.tsx):
- [x] Listagem de tópicos com filtros
- [x] Busca de tópicos
- [x] Criar novo tópico (modal)
- [x] Visualizar tópico completo (modal)
- [x] Sistema de respostas
- [x] Sistema de votação visual
- [x] Badges e indicadores visuais
- [x] Contadores (views, replies, votes)
- [x] Categorias coloridas
- [x] Status dos tópicos (open, pinned, resolved)

---

## 🔐 Segurança (RLS)

As políticas RLS garantem:
- ✅ Apenas usuários autenticados podem acessar o fórum
- ✅ Usuários não podem editar conteúdo de outros
- ✅ Professores têm as mesmas permissões (sem privilégios especiais)
- ✅ Votos são anônimos mas rastreáveis por usuário
- ✅ Proteção contra spam e edições maliciosas

---

## 📈 Próximos Passos

1. ✅ **Executar migration** no Supabase Dashboard
2. ✅ **Ativar código real** no Forum.tsx (substituir mock)
3. ✅ **Testar** com usuário testeprofessor@inglespareto.com.br
4. ⏳ **Implementar notificações** (opcional)
5. ⏳ **Sistema de moderação** (opcional)
6. ⏳ **Upload de imagens em posts** (opcional)

---

## 🆘 Troubleshooting

### Erro: "relation 'forum_topics' does not exist"
**Solução:** A migration não foi executada. Siga o passo 1 acima.

### Erro: "permission denied for table forum_topics"
**Solução:** As RLS policies não estão ativas. Execute toda a migration novamente.

### Tópicos não aparecem no frontend
**Solução:** Verifique se:
1. Migration foi executada com sucesso
2. Usuário está autenticado
3. Existem tópicos no banco de dados

### Votos não funcionam
**Solução:**
1. Verifique se a tabela `forum_votes` existe
2. Confirme que o usuário está autenticado
3. Teste com console.log para ver erros detalhados

---

**Criado em:** 30 de Setembro de 2025
**Por:** Claude Code
**Status:** Aguardando execução manual da migration

// Sistema de Templates de Aulas Pré-definidas
// Escola Inglês Pareto - Tipos e Interfaces

export type LessonType = 'group-beginner' | 'group-intermediate' | 'group-advanced' | 'open-conversation' | 'individual';

export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced';

export type Duration = 30 | 45 | 60;

// 7 Grandes Temas Universais
export type UniversalTheme =
  | 'relacionamentos-humanos'
  | 'trabalho-carreira'
  | 'vida-urbana-cotidiano'
  | 'saude-bem-estar'
  | 'viagem-culturas'
  | 'tecnologia-futuro'
  | 'entretenimento-cultura';

// Tópicos de Conversação Aberta (20 tópicos com gramática específica)
export interface ConversationTopic {
  id: string;
  name: string;
  grammarFocus: string;
  description: string;
}

// Template Base para Aulas
export interface LessonTemplate {
  id: string;
  type: LessonType;
  theme: UniversalTheme;
  topic: string;
  grammarFocus: string;
  difficulty: DifficultyLevel;
  duration: Duration;
  maxStudents: number;
  creditCost: 1 | 3; // Grupo = 1, Individual = 3

  // Campos que o professor deve preencher
  requiredFields: {
    title: string;
    description: string;
    objectives: string[];
    materials: string[];
    prerequisites?: string;
  };

  // Informações do template
  templateInfo: {
    suggestedActivities: string[];
    keyVocabulary: string[];
    commonMistakes: string[];
    culturalNotes?: string[];
  };
}

// Aula criada por professor baseada no template
export interface CreatedLesson {
  id: string;
  templateId: string;
  teacherId: string;

  // Campos preenchidos pelo professor
  title: string;
  description: string;
  objectives: string[];
  materials: string[];
  prerequisites?: string;

  // Informações de agendamento
  datetime: string;
  status: 'available' | 'booked' | 'completed' | 'cancelled';

  // Alunos inscritos
  enrolledStudents: string[];

  // Dados do template (referência)
  template: LessonTemplate;

  // Metadados
  createdAt: string;
  updatedAt: string;
}

// Constantes dos 7 Grandes Temas
export const UNIVERSAL_THEMES: Record<UniversalTheme, {
  name: string;
  basicTopics: string[];
  intermediateTopics: string[];
  advancedTopics: string[];
}> = {
  'relacionamentos-humanos': {
    name: 'Relacionamentos Humanos',
    basicTopics: ['família', 'amigos', 'apresentações'],
    intermediateTopics: ['relacionamentos profissionais', 'networking', 'conflitos simples'],
    advancedTopics: ['dinâmicas sociais', 'conflitos complexos', 'negociações']
  },
  'trabalho-carreira': {
    name: 'Trabalho & Carreira',
    basicTopics: ['profissões', 'rotina de trabalho', 'escritório'],
    intermediateTopics: ['entrevistas', 'reuniões', 'projetos'],
    advancedTopics: ['liderança', 'estratégias', 'economia global']
  },
  'vida-urbana-cotidiano': {
    name: 'Vida Urbana & Cotidiano',
    basicTopics: ['casa', 'transporte', 'compras'],
    intermediateTopics: ['serviços', 'problemas urbanos', 'comunidade'],
    advancedTopics: ['planejamento urbano', 'sustentabilidade', 'políticas públicas']
  },
  'saude-bem-estar': {
    name: 'Saúde & Bem-estar',
    basicTopics: ['corpo', 'sintomas básicos', 'médico'],
    intermediateTopics: ['medicina', 'exercícios', 'nutrição'],
    advancedTopics: ['saúde mental', 'políticas de saúde', 'pesquisa médica']
  },
  'viagem-culturas': {
    name: 'Viagem & Culturas',
    basicTopics: ['turismo', 'direções', 'hotel'],
    intermediateTopics: ['diferenças culturais', 'adaptação', 'costumes'],
    advancedTopics: ['globalização', 'identidade cultural', 'imigração']
  },
  'tecnologia-futuro': {
    name: 'Tecnologia & Futuro',
    basicTopics: ['dispositivos', 'redes sociais', 'internet'],
    intermediateTopics: ['impacto no trabalho', 'comunicação digital', 'privacidade'],
    advancedTopics: ['IA', 'ética tecnológica', 'transformação social']
  },
  'entretenimento-cultura': {
    name: 'Entretenimento & Cultura',
    basicTopics: ['filmes', 'música', 'esportes'],
    intermediateTopics: ['indústria cultural', 'arte', 'mídia'],
    advancedTopics: ['crítica cultural', 'influência mídia', 'arte contemporânea']
  }
};

// 20 Tópicos de Conversação Aberta
export const CONVERSATION_TOPICS: ConversationTopic[] = [
  { id: '1', name: 'Comida & Sabores', grammarFocus: 'Modal Verbs', description: 'Can you cook?, Should I try this?, Would you like some?' },
  { id: '2', name: 'Viagem & Lugares', grammarFocus: 'There is/are', description: 'There are beautiful beaches, Is there a hotel nearby?' },
  { id: '3', name: 'Família & Relacionamentos', grammarFocus: 'Possessives', description: 'My sister\'s husband, Our family traditions, Their children' },
  { id: '4', name: 'Trabalho & Sonhos', grammarFocus: 'Future', description: 'I will be a doctor, I\'m going to change careers' },
  { id: '5', name: 'Memórias & Infância', grammarFocus: 'Past Simple (Irregular)', description: 'I went to school, We had a dog, I saw my grandmother' },
  { id: '6', name: 'Tecnologia & Mudanças', grammarFocus: 'Present Perfect Simple', description: 'Technology has changed everything, I have used smartphones for years' },
  { id: '7', name: 'Fins de Semana & Tempo Livre', grammarFocus: 'How Often + Frequency Adverbs', description: 'How often do you exercise?, I always relax on Sundays' },
  { id: '8', name: 'Medos & Superações', grammarFocus: 'Second Conditional', description: 'If I were braver, I would..., What would you do if...?' },
  { id: '9', name: 'Casa & Espaços', grammarFocus: 'Prepositions', description: 'In my room, Under the bed, Next to the kitchen' },
  { id: '10', name: 'Cultura & Entretenimento', grammarFocus: 'Comparatives + Superlatives', description: 'This movie is better than..., The best singer ever' },
  { id: '11', name: 'Estações & Clima', grammarFocus: 'First Conditional', description: 'If it rains, I will stay home, If it\'s sunny, we\'ll go out' },
  { id: '12', name: 'Transporte & Mobilidade', grammarFocus: 'Past Continuous', description: 'I was driving when..., We were waiting for the bus' },
  { id: '13', name: 'Dinheiro & Compras', grammarFocus: 'Present Simple (Questions)', description: 'Do you save money?, How much does it cost?' },
  { id: '14', name: 'Saúde & Corpo', grammarFocus: 'Present Continuous', description: 'I\'m feeling sick, The doctor is examining me' },
  { id: '15', name: 'Animais & Pets', grammarFocus: 'To Be', description: 'My dog is friendly, Cats are independent, I am allergic to...' },
  { id: '16', name: 'Aprendizado & Educação', grammarFocus: 'Present Perfect Continuous', description: 'I have been studying English for 3 years' },
  { id: '17', name: 'Mudanças & Transformações', grammarFocus: 'Past Perfect', description: 'I had never lived alone before moving out' },
  { id: '18', name: 'Celebrações & Tradições', grammarFocus: 'WH Questions', description: 'What do you celebrate?, When is your birthday?, Where do you party?' },
  { id: '19', name: 'Esportes & Movimento', grammarFocus: 'Present Simple (Affirmative/Negative)', description: 'I play soccer, I don\'t like running' },
  { id: '20', name: 'Natureza & Ambiente', grammarFocus: 'Third Conditional', description: 'If we had protected nature better, we wouldn\'t have climate change' }
];

// Função helper para gerar template ID
export const generateTemplateId = (type: LessonType, theme: UniversalTheme, topic: string): string => {
  const sanitizedTopic = topic.toLowerCase().replace(/\s+/g, '-');
  return `${type}-${theme}-${sanitizedTopic}`;
};

// Função helper para obter custo em créditos
export const getCreditCost = (type: LessonType): 1 | 3 => {
  return type === 'individual' ? 3 : 1;
};

// Função helper para obter máximo de alunos
export const getMaxStudents = (type: LessonType): number => {
  switch (type) {
    case 'individual': return 1;
    case 'open-conversation': return 8;
    default: return 6; // group lessons
  }
};
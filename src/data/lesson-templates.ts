// Base de dados de Templates de Aulas Pré-definidas
// Escola Inglês Pareto

import {
  LessonTemplate,
  UniversalTheme,
  LessonType,
  DifficultyLevel,
  UNIVERSAL_THEMES,
  CONVERSATION_TOPICS,
  generateTemplateId,
  getCreditCost,
  getMaxStudents
} from '../types/lesson-templates';

// Função para criar template base
const createTemplate = (
  type: LessonType,
  theme: UniversalTheme,
  topic: string,
  difficulty: DifficultyLevel,
  grammarFocus: string,
  duration: 30 | 45 | 60 = 45
): LessonTemplate => ({
  id: generateTemplateId(type, theme, topic),
  type,
  theme,
  topic,
  grammarFocus,
  difficulty,
  duration,
  maxStudents: getMaxStudents(type),
  creditCost: getCreditCost(type),

  requiredFields: {
    title: '',
    description: '',
    objectives: [],
    materials: [],
    prerequisites: ''
  },

  templateInfo: {
    suggestedActivities: [],
    keyVocabulary: [],
    commonMistakes: [],
    culturalNotes: []
  }
});

// Templates para Aulas em Grupo - Iniciante
const GROUP_BEGINNER_TEMPLATES: LessonTemplate[] = [
  // Relacionamentos Humanos - Básico
  {
    ...createTemplate('group-beginner', 'relacionamentos-humanos', 'família', 'basic', 'Present Simple + Family Vocabulary'),
    templateInfo: {
      suggestedActivities: ['Family tree presentation', 'Role-play family introductions', 'Photo description'],
      keyVocabulary: ['mother', 'father', 'sister', 'brother', 'grandmother', 'grandfather', 'aunt', 'uncle'],
      commonMistakes: ['He/She confusion', 'Possessive \'s placement', 'This is vs These are'],
      culturalNotes: ['Family structures vary across cultures', 'Extended family importance']
    }
  },
  {
    ...createTemplate('group-beginner', 'relacionamentos-humanos', 'amigos', 'basic', 'Adjectives + Personality'),
    templateInfo: {
      suggestedActivities: ['Describe your best friend', 'Personality quiz', 'Friendship stories'],
      keyVocabulary: ['kind', 'funny', 'smart', 'loyal', 'friendly', 'honest', 'creative', 'patient'],
      commonMistakes: ['Very vs Too usage', 'Adjective order', 'He is vs He has'],
      culturalNotes: ['Different friendship customs', 'Personal space concepts']
    }
  },

  // Trabalho & Carreira - Básico
  {
    ...createTemplate('group-beginner', 'trabalho-carreira', 'profissões', 'basic', 'Present Simple + Jobs Vocabulary'),
    templateInfo: {
      suggestedActivities: ['Job guessing game', 'Daily routine of different jobs', 'Interview simulation'],
      keyVocabulary: ['teacher', 'doctor', 'engineer', 'nurse', 'driver', 'cook', 'student', 'manager'],
      commonMistakes: ['A vs An with jobs', 'Work vs Job distinction', 'Third person -s'],
      culturalNotes: ['Job hierarchies in different countries', 'Gender roles in professions']
    }
  },

  // Vida Urbana - Básico
  {
    ...createTemplate('group-beginner', 'vida-urbana-cotidiano', 'casa', 'basic', 'There is/are + Rooms and Furniture'),
    templateInfo: {
      suggestedActivities: ['House tour description', 'Dream house design', 'Furniture placement game'],
      keyVocabulary: ['kitchen', 'bedroom', 'bathroom', 'living room', 'sofa', 'table', 'bed', 'chair'],
      commonMistakes: ['There is/are agreement', 'Prepositions of place', 'Countable/uncountable furniture'],
      culturalNotes: ['Different housing types', 'Room usage varies by culture']
    }
  },

  // Saúde - Básico
  {
    ...createTemplate('group-beginner', 'saude-bem-estar', 'corpo', 'basic', 'Body Parts + Have/Has'),
    templateInfo: {
      suggestedActivities: ['Body parts song', 'Doctor visit role-play', 'Health problems discussion'],
      keyVocabulary: ['head', 'arm', 'leg', 'hand', 'foot', 'back', 'stomach', 'throat'],
      commonMistakes: ['Have vs Has with health', 'Body parts articles', 'Pain expressions'],
      culturalNotes: ['Healthcare systems', 'Traditional medicine views']
    }
  },

  // Viagem - Básico
  {
    ...createTemplate('group-beginner', 'viagem-culturas', 'turismo', 'basic', 'Can for ability + Travel vocabulary'),
    templateInfo: {
      suggestedActivities: ['Travel planning', 'Tourist information role-play', 'Vacation photos description'],
      keyVocabulary: ['hotel', 'airport', 'beach', 'museum', 'restaurant', 'taxi', 'ticket', 'camera'],
      commonMistakes: ['Can vs Can\'t pronunciation', 'Travel vs Trip', 'Hotel prepositions'],
      culturalNotes: ['Tourism impacts', 'Cultural sensitivity when traveling']
    }
  },

  // Tecnologia - Básico
  {
    ...createTemplate('group-beginner', 'tecnologia-futuro', 'dispositivos', 'basic', 'Present Continuous + Technology'),
    templateInfo: {
      suggestedActivities: ['Technology in daily life', 'Phone features exploration', 'Digital generation gap'],
      keyVocabulary: ['phone', 'computer', 'internet', 'email', 'website', 'app', 'video', 'photo'],
      commonMistakes: ['Present continuous formation', 'Technology articles', 'Use vs Used'],
      culturalNotes: ['Digital divide globally', 'Technology adoption rates']
    }
  },

  // Entretenimento - Básico
  {
    ...createTemplate('group-beginner', 'entretenimento-cultura', 'filmes', 'basic', 'Like/Love/Hate + Entertainment'),
    templateInfo: {
      suggestedActivities: ['Movie review sharing', 'Genre preferences discussion', 'Favorite actor presentation'],
      keyVocabulary: ['movie', 'actor', 'comedy', 'drama', 'action', 'romance', 'theater', 'ticket'],
      commonMistakes: ['Like + gerund vs infinitive', 'Movie vs Film', 'Entertainment prepositions'],
      culturalNotes: ['Film industries worldwide', 'Cultural values in movies']
    }
  }
];

// Templates para Aulas em Grupo - Intermediário
const GROUP_INTERMEDIATE_TEMPLATES: LessonTemplate[] = [
  // Trabalho & Carreira - Intermediário
  {
    ...createTemplate('group-intermediate', 'trabalho-carreira', 'entrevistas', 'intermediate', 'Past Experience + Job Interview Language', 60),
    templateInfo: {
      suggestedActivities: ['Mock job interviews', 'Resume building', 'Salary negotiation practice'],
      keyVocabulary: ['experience', 'qualification', 'achievement', 'responsibility', 'challenge', 'opportunity', 'promotion', 'colleague'],
      commonMistakes: ['Present Perfect vs Past Simple in experience', 'Formal register consistency', 'Question formation in interviews'],
      culturalNotes: ['Interview etiquette varies', 'Work culture differences', 'Professional networking importance']
    }
  },

  // Relacionamentos - Intermediário
  {
    ...createTemplate('group-intermediate', 'relacionamentos-humanos', 'networking', 'intermediate', 'Modal Verbs for Suggestions + Professional Relationships'),
    templateInfo: {
      suggestedActivities: ['Professional networking event simulation', 'Small talk practice', 'Business card exchange'],
      keyVocabulary: ['contact', 'connection', 'opportunity', 'collaboration', 'partnership', 'recommendation', 'referral', 'mentor'],
      commonMistakes: ['Should vs Could for advice', 'Formal vs informal introductions', 'Professional email structure'],
      culturalNotes: ['Networking importance across cultures', 'Professional hierarchy respect', 'Business relationship building']
    }
  }
];

// Templates para Aulas em Grupo - Avançado
const GROUP_ADVANCED_TEMPLATES: LessonTemplate[] = [
  // Tecnologia - Avançado
  {
    ...createTemplate('group-advanced', 'tecnologia-futuro', 'ética tecnológica', 'advanced', 'Conditional Sentences + Technology Ethics', 60),
    templateInfo: {
      suggestedActivities: ['AI ethics debate', 'Technology impact analysis', 'Future predictions discussion'],
      keyVocabulary: ['artificial intelligence', 'privacy', 'surveillance', 'automation', 'ethics', 'responsibility', 'innovation', 'disruption'],
      commonMistakes: ['Complex conditional usage', 'Abstract concept explanations', 'Formal debate structure'],
      culturalNotes: ['Technology regulation differences', 'Cultural views on privacy', 'Innovation vs tradition balance']
    }
  }
];

// Templates para Conversação Aberta
const OPEN_CONVERSATION_TEMPLATES: LessonTemplate[] = CONVERSATION_TOPICS.map(topic => ({
  ...createTemplate('open-conversation', 'entretenimento-cultura', topic.name, 'intermediate', topic.grammarFocus, 45),
  templateInfo: {
    suggestedActivities: [
      'Free conversation practice',
      'Grammar focus exercises',
      'Real-life situation simulation',
      'Error correction activities'
    ],
    keyVocabulary: [], // To be filled by teacher based on topic
    commonMistakes: [], // To be identified during lesson
    culturalNotes: [topic.description]
  }
}));

// Templates para Aulas Individuais
const INDIVIDUAL_TEMPLATES: LessonTemplate[] = [
  {
    ...createTemplate('individual', 'relacionamentos-humanos', 'personalizado', 'basic', 'Adapted to student needs', 60),
    templateInfo: {
      suggestedActivities: [
        'Personalized conversation practice',
        'Individual grammar focus',
        'Specific skill development',
        'Confidence building exercises'
      ],
      keyVocabulary: [], // Customized per student
      commonMistakes: [], // Student-specific
      culturalNotes: ['Adapted to student background and interests']
    }
  }
];

// Exportar todos os templates
export const ALL_LESSON_TEMPLATES: LessonTemplate[] = [
  ...GROUP_BEGINNER_TEMPLATES,
  ...GROUP_INTERMEDIATE_TEMPLATES,
  ...GROUP_ADVANCED_TEMPLATES,
  ...OPEN_CONVERSATION_TEMPLATES,
  ...INDIVIDUAL_TEMPLATES
];

// Funções helper para filtrar templates
export const getTemplatesByType = (type: LessonType): LessonTemplate[] => {
  return ALL_LESSON_TEMPLATES.filter(template => template.type === type);
};

export const getTemplatesByTheme = (theme: UniversalTheme): LessonTemplate[] => {
  return ALL_LESSON_TEMPLATES.filter(template => template.theme === theme);
};

export const getTemplatesByDifficulty = (difficulty: DifficultyLevel): LessonTemplate[] => {
  return ALL_LESSON_TEMPLATES.filter(template => template.difficulty === difficulty);
};

export const getTemplateById = (id: string): LessonTemplate | undefined => {
  return ALL_LESSON_TEMPLATES.find(template => template.id === id);
};

// Estatísticas dos templates
export const TEMPLATE_STATS = {
  total: ALL_LESSON_TEMPLATES.length,
  byType: {
    'group-beginner': getTemplatesByType('group-beginner').length,
    'group-intermediate': getTemplatesByType('group-intermediate').length,
    'group-advanced': getTemplatesByType('group-advanced').length,
    'open-conversation': getTemplatesByType('open-conversation').length,
    'individual': getTemplatesByType('individual').length
  },
  byDifficulty: {
    basic: getTemplatesByDifficulty('basic').length,
    intermediate: getTemplatesByDifficulty('intermediate').length,
    advanced: getTemplatesByDifficulty('advanced').length
  }
};
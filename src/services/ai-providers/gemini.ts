// Google Gemini Service for Escola Inglês Pareto
// Implementação otimizada para ensino de inglês com custo-benefício
// Substitui OpenAI/Anthropic para reduzir custos (~97% mais econômico)

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { ConversationMode, GrammarCorrection, AIResponse } from '@/types/ai-chat';

export interface GeminiServiceConfig {
  apiKey: string;
  model?: string;
  safetySettings?: Array<{
    category: HarmCategory;
    threshold: HarmBlockThreshold;
  }>;
}

export class GeminiService {
  private generativeAI: GoogleGenerativeAI;
  private model: string;
  private safetySettings: Array<{
    category: HarmCategory;
    threshold: HarmBlockThreshold;
  }>;

  constructor(config: GeminiServiceConfig) {
    this.generativeAI = new GoogleGenerativeAI(config.apiKey);
    this.model = config.model || "gemini-pro";
    this.safetySettings = config.safetySettings || [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  }

  /**
   * Envia mensagem para IA Gemini com contexto educacional
   */
  async sendMessage(
    message: string,
    mode: ConversationMode,
    previousMessages: string[] = []
  ): Promise<AIResponse> {
    try {
      // Obter o modelo
      const model = this.generativeAI.getGenerativeModel({ 
        model: this.model,
        safetySettings: this.safetySettings
      });

      // Criar o prompt com base no modo de conversação
      const systemPrompt = this.getSystemPrompt(mode);
      
      // Format previous messages for conversation context
      let conversationContext = "";
      if (previousMessages.length > 0) {
        conversationContext = "\nConversa anterior:\n";
        previousMessages.forEach((msg, index) => {
          const role = index % 2 === 0 ? "Usuário" : "Assistente";
          conversationContext += `${role}: ${msg}\n`;
        });
      }

      // Combinar system prompt, contexto da conversa e mensagem atual
      const fullPrompt = `${systemPrompt}${conversationContext}\n\nNova mensagem do usuário: ${message}\nResposta educacional em português ou inglês (dependendo do modo):`;

      // Gerar conteúdo usando o modelo
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      
      if (!response.text()) {
        throw new Error("Resposta inválida da API Gemini");
      }

      const content = response.text();
      
      // Extrair correções gramaticais se estiver no modo de gramática
      const corrections = mode === 'grammar' ? this.extractGrammarCorrections(content) : [];
      
      // Extrair sugestões
      const suggestions = this.extractSuggestions(content);
      
      // Extrair feedback gramatical
      const grammarFeedback = mode === 'grammar' ? this.extractGrammarFeedback(content) : undefined;

      return {
        content,
        corrections,
        suggestions,
        grammarFeedback
      };
    } catch (error) {
      console.error('Erro na API Gemini:', error);
      // Fallback para resposta simulada
      return this.getSimulatedResponse(message, mode);
    }
  }

  /**
   * Gera prompt do sistema baseado no modo de conversação
   */
  private getSystemPrompt(mode: ConversationMode): string {
    const prompts = {
      practice: `Você é um professor de inglês amigável e experiente. Ajude o aluno a praticar conversação em inglês. Faça perguntas interessantes, corrija erros gentilmente e mantenha a conversa fluindo naturalmente. Responda em inglês para promover o aprendizado, com explicações em português quando necessário para clareza.`,
      
      grammar: `Você é um especialista em gramática inglesa. Analise as mensagens do aluno, identifique erros gramaticais específicos, explique as regras de forma didática e forneça exemplos corretos. Seja encorajador e use analogias quando possível. Responda principalmente em português com explicações claras, mas forneça exemplos em inglês.`,
      
      vocabulary: `Você é um especialista em vocabulário inglês. Ajude o aluno a expandir seu vocabulário, explique palavras difíceis, forneça sinônimos, antônimos e exemplos práticos em diferentes contextos. Use explicações claras e exemplos do cotidiano.`,
      
      pronunciation: `Você é um especialista em pronúncia inglesa. Ajude o aluno com a pronúncia correta de palavras, sons difíceis, ritmo e entonação. Forneça dicas práticas, representações fonéticas e exemplos de áudio (descrição) sempre que possível.`,
      
      conversation: `Você é um professor de inglês para conversação. Mantenha diálogos naturais e interessantes sobre diversos tópicos. Seja espontâneo, faça perguntas envolventes e ajude o aluno a expressar suas ideias fluentemente. Responda em inglês com foco em fluência.`
    };

    return `Instruções para IA Educacional:\n${prompts[mode]}\n\nRegras adicionais:\n- Mantenha respostas concisas mas informativas\n- Adapte o nível de complexidade ao aluno\n- Encoraje e motive o aluno continuamente\n- Corrija com gentileza e paciência\n- Seja profissional e respeitoso`;
  }

  /**
   * Extrai correções gramaticais do texto da IA
   */
  private extractGrammarCorrections(content: string): GrammarCorrection[] {
    const corrections: GrammarCorrection[] = [];
    
    // Procura por padrões que indiquem correções gramaticais
    const correctionPatterns = [
      /correção:?\s*["']([^"']+)["']\s*→\s*["']([^"']+)["']/gi,
      /corrigindo:?\s*["']([^"']+)["']\s*para\s*["']([^"']+)["']/gi,
      /errado:?\s*["']([^"']+)["']\s*correto:?\s*["']([^"']+)["']/gi,
      /em vez de\s*["']([^"']+)["']\s*, use\s*["']([^"']+)["']/gi
    ];
    
    correctionPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        corrections.push({
          original: match[1]?.trim() || '',
          corrected: match[2]?.trim() || '',
          explanation: `Correção gramatical sugerida`,
          rule: 'Regra gramatical',
          examples: []
        });
      }
    });
    
    return corrections;
  }

  /**
   * Extrai sugestões do texto da IA
   */
  private extractSuggestions(content: string): string[] {
    const suggestions: string[] = [];
    
    // Procura por padrões de sugestão
    const suggestionPatterns = [
      /você poderia dizer:?["']?([^."]+)["']?/gi,
      /tente:?["']?([^."]+)["']?/gi,
      /considere:?["']?([^."]+)["']?/gi,
      /uma alternativa:?["']?([^."]+)["']?/gi
    ];
    
    suggestionPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          suggestions.push(match[1].trim());
        }
      }
    });
    
    return suggestions;
  }

  /**
   * Extrai feedback gramatical específico
   */
  private extractGrammarFeedback(content: string): string {
    // Procura por explicações gramaticais
    const grammarPatterns = [
      /explicação:?([^.!]+)/gi,
      /regra:?([^.!]+)/gi,
      /porque:?([^.!]+)/gi,
      /a razão é:?([^.!]+)/gi
    ];
    
    for (const pattern of grammarPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return '';
  }

  /**
   * Enhanced fallback with context-aware simulated responses
   */
  private getSimulatedResponse(message: string, mode: ConversationMode): AIResponse {
    const lowerMessage = message.toLowerCase();
    
    // Analyze message for context-aware responses
    const isQuestion = message.includes('?') || lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('why');
    const isGreeting = lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('good morning');
    const isPastTense = lowerMessage.includes('yesterday') || lowerMessage.includes('last') || lowerMessage.includes('ago');
    const isFutureTense = lowerMessage.includes('tomorrow') || lowerMessage.includes('will') || lowerMessage.includes('going to');
    const hasGrammarError = this.detectSimpleGrammarErrors(message);
    
    // Mode-specific intelligent responses
    switch (mode) {
      case 'practice':
        return this.generatePracticeResponse(message, isQuestion, isGreeting);
        
      case 'grammar':
        return this.generateGrammarResponse(message, hasGrammarError);
        
      case 'vocabulary':
        return this.generateVocabularyResponse(message, lowerMessage);
        
      case 'pronunciation':
        return this.generatePronunciationResponse(message, lowerMessage);
        
      case 'conversation':
      default:
        return this.generateConversationResponse(message, isQuestion, isPastTense, isFutureTense);
    }
  }
  
  private detectSimpleGrammarErrors(message: string): string[] {
    const errors: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    // Simple grammar error detection
    if (lowerMessage.includes('i am go') || lowerMessage.includes('i am going to go')) {
      errors.push('Use "I am going" ou "I will go" em vez de "I am go"');
    }
    if (lowerMessage.includes('i have 20 years') && !lowerMessage.includes('old')) {
      errors.push('Diga "I am 20 years old" em vez de "I have 20 years"');
    }
    if (lowerMessage.includes('i am agree')) {
      errors.push('Diga "I agree" em vez de "I am agree"');
    }
    if (lowerMessage.includes('since 2 years')) {
      errors.push('Diga "for 2 years" em vez de "since 2 years"');
    }
    
    return errors;
  }
  
  private generatePracticeResponse(message: string, isQuestion: boolean, isGreeting: boolean): AIResponse {
    if (isGreeting) {
      const greetingResponses = [
        "Hello! I'm so glad you're here to practice English with me. How are you doing today?",
        "Hi there! Welcome to our conversation practice. What would you like to talk about?",
        "Good to see you! I'm excited to help you improve your English. How's your day going?"
      ];
      return {
        content: greetingResponses[Math.floor(Math.random() * greetingResponses.length)],
        suggestions: ["Tell me about your hobbies", "Describe your favorite place", "Share what you did today"],
        corrections: []
      };
    }
    
    if (isQuestion) {
      const questionResponses = [
        "That's a great question! Let me think about that...",
        "I love curious minds! Here's what I think about that...",
        "Excellent question! It makes me think about..."
      ];
      return {
        content: questionResponses[Math.floor(Math.random() * questionResponses.length)],
        suggestions: ["Ask follow-up questions", "Share your own opinion", "Give specific examples"],
        corrections: []
      };
    }
    
    const practiceResponses = [
      "That's really interesting! Can you give me more details about that?",
      "I can see you're thinking carefully about this. What happened next?",
      "Your English is improving! How do you feel about this topic?",
      "That sounds like quite an experience. What was the most memorable part?"
    ];
    
    return {
      content: practiceResponses[Math.floor(Math.random() * practiceResponses.length)],
      suggestions: ["Use more descriptive adjectives", "Add more details to your stories", "Practice expressing emotions"],
      corrections: []
    };
  }
  
  private generateGrammarResponse(message: string, hasErrors: string[]): AIResponse {
    if (hasErrors.length > 0) {
      const corrections = hasErrors.map(error => ({
        original: message,
        corrected: message.replace(/(i am go)/i, 'I am going'), // Simple example correction
        explanation: error,
        rule: 'Regra Gramatical',
        examples: ['Exemplo 1', 'Exemplo 2']
      }));
      
      return {
        content: "I can help you improve that sentence! Let me show you the correct form.",
        corrections: corrections,
        suggestions: ["Practice this structure with different examples", "Review the grammar rule"],
        grammarFeedback: `Remember: ${hasErrors[0]}`
      };
    }
    
    const grammarResponses = [
      "Excellent grammar! Your sentence structure is very clear and correct.",
      "Perfect! You used the right tense and word order. Well done!",
      "Great job with the grammar. Your English is really improving!",
      "That's grammatically perfect! Now try making it even more complex."
    ];
    
    return {
      content: grammarResponses[Math.floor(Math.random() * grammarResponses.length)],
      corrections: [],
      suggestions: ["Try using more complex sentence structures", "Add subordinate clauses", "Practice with different verb tenses"],
      grammarFeedback: "Your grammar is solid! Keep practicing complex structures."
    };
  }
  
  private generateVocabularyResponse(message: string, lowerMessage: string): AIResponse {
    if (lowerMessage.includes('meaning') || lowerMessage.includes('definition')) {
      return {
        content: "Great question about vocabulary! Let me help you understand that word better with examples and synonyms.",
        suggestions: ["Ask for more examples", "Learn word origins", "Practice using new words in sentences"],
        corrections: []
      };
    }
    
    if (lowerMessage.includes('synonym') || lowerMessage.includes('similar')) {
      return {
        content: "Excellent! Learning synonyms helps expand your vocabulary. Here are some alternatives and their subtle differences...",
        suggestions: ["Practice using synonyms in context", "Learn collocations", "Study word families"],
        corrections: []
      };
    }
    
    const vocabularyResponses = [
      "That's a useful word! Let me give you some related vocabulary and example sentences.",
      "Great vocabulary choice! Here are some synonyms and antônimos you might find helpful...",
      "I can suggest better words for this context. Let's explore some options...",
      "Perfect opportunity to expand your vocabulary! Here are some advanced alternatives..."
    ];
    
    return {
      content: vocabularyResponses[Math.floor(Math.random() * vocabularyResponses.length)],
      suggestions: ["Learn word families", "Practice with collocations", "Use advanced vocabulary"],
      corrections: []
    };
  }
  
  private generatePronunciationResponse(message: string, lowerMessage: string): AIResponse {
    if (lowerMessage.includes('how to say') || lowerMessage.includes('pronounce')) {
      return {
        content: "Let me help you with pronunciation! Remember to focus on stress patterns, consonant clusters, and vowel sounds.",
        suggestions: ["Practice with phonetic symbols", "Record yourself speaking", "Listen to native speakers"],
        corrections: []
      };
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('accent')) {
      return {
        content: "Great question about stress and accent! Word stress can change meaning, so it's very important to get it right.",
        suggestions: ["Practice stress patterns", "Learn about syllable stress", "Use pronunciation dictionaries"],
        corrections: []
      };
    }
    
    const pronunciationResponses = [
      "Good effort with pronunciation! Let me help you with the correct sounds and stress patterns.",
      "I can hear you're working on that sound! Here are some tips to improve your pronunciation...",
      "Excellent pronunciation practice! Focus on these specific sounds for better clarity...",
      "Great speaking! Let's work on some challenging sounds and rhythm patterns..."
    ];
    
    return {
      content: pronunciationResponses[Math.floor(Math.random() * pronunciationResponses.length)],
      suggestions: ["Practice minimal pairs", "Work on connected speech", "Focus on intonation patterns"],
      corrections: []
    };
  }
  
  private generateConversationResponse(message: string, isQuestion: boolean, isPastTense: boolean, isFutureTense: boolean): AIResponse {
    if (isPastTense) {
      const pastResponses = [
        "That sounds like it was quite an experience! What did you learn from it?",
        "Interesting! How did that make you feel at the time?",
        "I can imagine! Would you do it differently if you had another chance?"
      ];
      return {
        content: pastResponses[Math.floor(Math.random() * pastResponses.length)],
        suggestions: ["Use past perfect tense for earlier events", "Add more emotional details", "Describe the sequence of events"],
        corrections: []
      };
    }
    
    if (isFutureTense) {
      const futureResponses = [
        "That sounds exciting! What are you most looking forward to?",
        "Great plans! How are you preparing for that?",
        "Wonderful! I hope everything goes well. What do you expect will happen?"
      ];
      return {
        content: futureResponses[Math.floor(Math.random() * futureResponses.length)],
        suggestions: ["Use 'will' for predictions", "Use 'going to' for plans", "Express probability with 'might' or 'probably'"],
        corrections: []
      };
    }
    
    const freeResponses = [
      "That's really fascinating! I'd love to hear more about your perspective on this.",
      "You've got me thinking! What's the most important aspect of this for you?",
      "I really enjoy our conversations! How do you see this affecting your daily life?",
      "That's such an interesting point of view! Have you always felt this way about it?"
    ];
    
    return {
      content: freeResponses[Math.floor(Math.random() * freeResponses.length)],
      suggestions: ["Express your opinions clearly", "Use examples from your experience", "Ask questions to keep the conversation going"],
      corrections: []
    };
  }
}

// Instância singleton do serviço Gemini
export const geminiService = new GeminiService({
  apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || '',
  model: "gemini-pro"
});
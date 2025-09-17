// Serviço para integração com APIs de IA (OpenAI, Anthropic)
// Escola Inglês Pareto - Chat IA para ensino de inglês

import { ConversationMode } from '@/types/ai-chat';

export interface AIResponse {
  content: string;
  corrections?: string[];
  suggestions?: string[];
  grammarFeedback?: string;
}

export class AIChatService {
  private openaiApiKey: string;
  private anthropicApiKey: string;

  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.anthropicApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
  }

  /**
   * Verifica se pelo menos uma API está configurada
   */
  isConfigured(): boolean {
    return !!(this.openaiApiKey || this.anthropicApiKey);
  }

  /**
   * Envia mensagem para IA com contexto educacional
   */
  async sendMessage(
    message: string,
    mode: ConversationMode,
    previousMessages: string[] = []
  ): Promise<AIResponse> {
    if (!this.isConfigured()) {
      console.warn('⚠️ AI Chat não configurado - usando respostas simuladas');
      return this.getSimulatedResponse(message, mode);
    }

    try {
      // Prioriza OpenAI se disponível
      if (this.openaiApiKey) {
        return await this.sendToOpenAI(message, mode, previousMessages);
      } else if (this.anthropicApiKey) {
        return await this.sendToAnthropic(message, mode, previousMessages);
      }
    } catch (error) {
      console.error('Erro na API de IA:', error);
      // Fallback para resposta simulada
      return this.getSimulatedResponse(message, mode);
    }

    return this.getSimulatedResponse(message, mode);
  }

  /**
   * Integração com OpenAI ChatGPT
   */
  private async sendToOpenAI(
    message: string,
    mode: ConversationMode,
    previousMessages: string[]
  ): Promise<AIResponse> {
    const systemPrompt = this.getSystemPrompt(mode);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...previousMessages.map((msg, index) => ({
            role: index % 2 === 0 ? 'user' : 'assistant',
            content: msg
          })),
          { role: 'user', content: message }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';

    return {
      content,
      corrections: this.extractCorrections(content),
      suggestions: this.extractSuggestions(content),
      grammarFeedback: mode === 'grammar' ? this.extractGrammarFeedback(content) : undefined
    };
  }

  /**
   * Integração com Anthropic Claude
   */
  private async sendToAnthropic(
    message: string,
    mode: ConversationMode,
    previousMessages: string[]
  ): Promise<AIResponse> {
    const systemPrompt = this.getSystemPrompt(mode);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.anthropicApiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        system: systemPrompt,
        messages: [
          ...previousMessages.map((msg, index) => ({
            role: index % 2 === 0 ? 'user' : 'assistant',
            content: msg
          })),
          { role: 'user', content: message }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text || 'Desculpe, não consegui processar sua mensagem.';

    return {
      content,
      corrections: this.extractCorrections(content),
      suggestions: this.extractSuggestions(content),
      grammarFeedback: mode === 'grammar' ? this.extractGrammarFeedback(content) : undefined
    };
  }

  /**
   * Gera prompt do sistema baseado no modo de conversação
   */
  private getSystemPrompt(mode: ConversationMode): string {
    const prompts = {
      practice: 'Você é um professor de inglês amigável. Ajude o aluno a praticar conversação em inglês. Faça perguntas interessantes, corrija erros gentilmente e mantenha a conversa fluindo naturalmente. Responda em inglês.',

      grammar: 'Você é um especialista em gramática inglesa. Analise as mensagens do aluno, identifique erros gramaticais, explique as regras e forneça exemplos corretos. Seja didático e encorajador. Responda em português para explicações e em inglês para exemplos.',

      business: 'Você é um especialista em inglês para negócios. Ajude o aluno com vocabulário profissional, expressões formais, e-mails corporativos e apresentações. Mantenha um tom profissional mas acessível. Responda em inglês.',

      exam: 'Você é um preparador para exames de inglês (IELTS, TOEFL, etc.). Ajude o aluno com estratégias de teste, vocabulário acadêmico e estruturas formais. Forneça feedback detalhado sobre fluência e precisão. Responda em inglês.',

      free: 'Você é um professor de inglês versátil. Adapte-se ao tópico que o aluno quiser conversar, seja educativo e divertido. Corrija erros quando necessário e expanda o vocabulário do aluno. Responda em inglês.'
    };

    return prompts[mode] || prompts.free;
  }

  /**
   * Extrai correções do texto da IA
   */
  private extractCorrections(content: string): string[] {
    const corrections: string[] = [];
    // Procura por padrões de correção como "*correction*" ou "should be:"
    const correctionPatterns = [
      /\*([^*]+)\*/g,
      /should be:?\s*([^.!?]+)/gi,
      /correct form:?\s*([^.!?]+)/gi
    ];

    correctionPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        corrections.push(...matches);
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
      /you could say:?\s*([^.!?]+)/gi,
      /try:?\s*([^.!?]+)/gi,
      /consider:?\s*([^.!?]+)/gi
    ];

    suggestionPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        suggestions.push(...matches);
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
      /grammar:?\s*([^.!?]+)/gi,
      /rule:?\s*([^.!?]+)/gi,
      /because:?\s*([^.!?]+)/gi
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
   * Fallback com respostas simuladas quando API não está disponível
   */
  private getSimulatedResponse(message: string, mode: ConversationMode): AIResponse {
    const responses = {
      practice: [
        "That's interesting! Can you tell me more about that?",
        "I understand. How do you feel about this situation?",
        "That sounds like a great experience! What was the best part?",
        "Let me help you express that better. You could say..."
      ],
      grammar: [
        "Good effort! Let me help you with the grammar here.",
        "I notice a small grammar mistake. The correct form would be...",
        "Perfect grammar! You're improving nicely.",
        "Let's practice this structure: Subject + Verb + Object"
      ],
      business: [
        "In a business context, you might say...",
        "That's a good professional expression. Here's another way...",
        "For formal emails, consider using...",
        "In presentations, it's common to say..."
      ],
      exam: [
        "For IELTS speaking, remember to elaborate on your points.",
        "Good vocabulary choice! Try to add more descriptive words.",
        "Practice linking your ideas with transition words.",
        "Remember to answer all parts of the question."
      ],
      free: [
        "That's fascinating! Tell me more.",
        "I love talking about that topic!",
        "What's your opinion on this?",
        "Have you experienced something similar?"
      ]
    };

    const modeResponses = responses[mode] || responses.free;
    const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];

    return {
      content: randomResponse,
      corrections: mode === 'grammar' ? ['*small correction example*'] : [],
      suggestions: ['Try expanding your answer', 'Use more descriptive adjectives'],
      grammarFeedback: mode === 'grammar' ? 'Remember to check verb tenses' : undefined
    };
  }
}

// Instância singleton do serviço
export const aiChatService = new AIChatService();
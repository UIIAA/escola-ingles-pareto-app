// Serviço para Speech Recognition e Text-to-Speech
// Escola Inglês Pareto - Recursos de voz para Chat IA

export interface SpeechConfig {
  language: string;
  accent: string;
  enabled: boolean;
}

export interface RecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isRecording = false;
  private onResult: ((result: RecognitionResult) => void) | null = null;
  private onError: ((error: string) => void) | null = null;

  constructor() {
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
  }

  /**
   * Inicializa Speech Recognition (Speech-to-Text)
   */
  private initializeSpeechRecognition() {
    // Verifica suporte do navegador
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('⚠️ Speech Recognition não suportado neste navegador');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    // Eventos do Speech Recognition
    this.recognition.onresult = (event) => {
      let transcript = '';
      let confidence = 0;
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
        confidence = event.results[i][0].confidence;
        isFinal = event.results[i].isFinal;
      }

      if (this.onResult) {
        this.onResult({
          transcript: transcript.trim(),
          confidence,
          isFinal
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Erro no Speech Recognition:', event.error);
      this.isRecording = false;

      if (this.onError) {
        const errorMessage = this.getErrorMessage(event.error);
        this.onError(errorMessage);
      }
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      console.log('🎤 Gravação finalizada');
    };
  }

  /**
   * Inicializa Speech Synthesis (Text-to-Speech)
   */
  private initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    } else {
      console.warn('⚠️ Speech Synthesis não suportado neste navegador');
    }
  }

  /**
   * Verifica se Speech Recognition está disponível
   */
  isSpeechRecognitionAvailable(): boolean {
    return this.recognition !== null;
  }

  /**
   * Verifica se Speech Synthesis está disponível
   */
  isSpeechSynthesisAvailable(): boolean {
    return this.synthesis !== null;
  }

  /**
   * Inicia gravação de voz
   */
  startRecording(
    config: SpeechConfig,
    onResult: (result: RecognitionResult) => void,
    onError: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech Recognition não está disponível');
      return false;
    }

    if (this.isRecording) {
      console.warn('⚠️ Gravação já está em andamento');
      return false;
    }

    try {
      this.onResult = onResult;
      this.onError = onError;
      this.recognition.lang = config.language;

      this.recognition.start();
      this.isRecording = true;
      console.log('🎤 Iniciando gravação...');
      return true;
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      onError('Erro ao acessar microfone');
      return false;
    }
  }

  /**
   * Para gravação de voz
   */
  stopRecording(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
      console.log('🎤 Parando gravação...');
    }
  }

  /**
   * Verifica se está gravando
   */
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Reproduz texto como áudio (Text-to-Speech)
   */
  speak(
    text: string,
    config: SpeechConfig,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.synthesis) {
      onError?.('Speech Synthesis não está disponível');
      return false;
    }

    // Para qualquer reprodução anterior
    this.stopSpeaking();

    try {
      const utterance = new SpeechSynthesisUtterance(text);

      // Configurações de voz
      utterance.lang = config.language;
      utterance.rate = 0.9; // Velocidade um pouco mais lenta para aprendizado
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Tenta encontrar uma voz específica
      const voices = this.synthesis.getVoices();
      const preferredVoice = this.findBestVoice(voices, config.language, config.accent);
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Eventos
      utterance.onstart = () => {
        console.log('🔊 Iniciando reprodução de áudio');
        onStart?.();
      };

      utterance.onend = () => {
        console.log('🔊 Áudio finalizado');
        onEnd?.();
      };

      utterance.onerror = (event) => {
        console.error('Erro na reprodução:', event.error);
        onError?.('Erro ao reproduzir áudio');
      };

      this.synthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Erro ao configurar reprodução:', error);
      onError?.('Erro ao reproduzir áudio');
      return false;
    }
  }

  /**
   * Para reprodução atual
   */
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  /**
   * Verifica se está reproduzindo
   */
  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false;
  }

  /**
   * Encontra a melhor voz disponível
   */
  private findBestVoice(voices: SpeechSynthesisVoice[], language: string, accent: string): SpeechSynthesisVoice | null {
    // Primeira tentativa: voz exata (idioma + sotaque)
    let voice = voices.find(v =>
      v.lang.toLowerCase().includes(language.toLowerCase()) &&
      v.name.toLowerCase().includes(accent.toLowerCase())
    );

    if (voice) return voice;

    // Segunda tentativa: apenas idioma
    voice = voices.find(v => v.lang.toLowerCase().includes(language.toLowerCase()));

    if (voice) return voice;

    // Terceira tentativa: inglês americano como padrão
    if (language.includes('en')) {
      voice = voices.find(v => v.lang.includes('en-US'));
    }

    return voice || null;
  }

  /**
   * Obtém vozes disponíveis
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];

    let voices = this.synthesis.getVoices();

    // Algumas vezes as vozes não estão carregadas imediatamente
    if (voices.length === 0) {
      this.synthesis.onvoiceschanged = () => {
        voices = this.synthesis!.getVoices();
      };
    }

    return voices;
  }

  /**
   * Converte código de erro em mensagem amigável
   */
  private getErrorMessage(error: string): string {
    const errorMessages = {
      'no-speech': 'Nenhuma fala detectada. Tente falar mais próximo ao microfone.',
      'audio-capture': 'Erro ao acessar microfone. Verifique as permissões.',
      'not-allowed': 'Acesso ao microfone negado. Permita o uso do microfone.',
      'network': 'Erro de rede. Verifique sua conexão.',
      'language-not-supported': 'Idioma não suportado.',
      'service-not-allowed': 'Serviço de reconhecimento não permitido.',
      'bad-grammar': 'Erro na gramática de reconhecimento.',
      'aborted': 'Reconhecimento cancelado.'
    };

    return errorMessages[error as keyof typeof errorMessages] || `Erro desconhecido: ${error}`;
  }

  /**
   * Solicita permissão do microfone
   */
  async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Para o stream imediatamente
      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissão do microfone:', error);
      return false;
    }
  }
}

// Declarações TypeScript para APIs Web Speech
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

// Instância singleton do serviço
export const speechService = new SpeechService();
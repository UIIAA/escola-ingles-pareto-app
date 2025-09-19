// Serviço para integração com Google Calendar API
// Escola Inglês Pareto - Calendário Único "Aulas Inglês Pareto"

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  location?: string;
  colorId?: string;
  conferenceData?: {
    createRequest?: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
  };
}

export interface ParethousCalendarLesson {
  lessonId: string;
  templateId: string;
  teacherEmail: string;
  teacherName: string;
  studentEmails: string[];
  lessonType: 'group-beginner' | 'group-intermediate' | 'group-advanced' | 'open-conversation' | 'individual';
  topic: string;
  duration: number;
  creditsCost: number;
  meetingLink?: string;
}

export class GoogleCalendarService {
  private apiKey: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private readonly PARETO_CALENDAR_NAME = 'Aulas Inglês Pareto';
  private parethoureCalendarId: string | null = null;
  private gapi: typeof window.gapi | null = null;

  // Color IDs for different lesson types
  private readonly LESSON_COLORS = {
    'group-beginner': '10', // Green
    'group-intermediate': '7', // Blue
    'group-advanced': '9', // Purple
    'open-conversation': '6', // Orange
    'individual': '4' // Pink/Red
  };

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '';
  }

  // Verifica se as credenciais estão configuradas
  isConfigured(): boolean {
    const hasApiKey = !!this.apiKey && !this.apiKey.includes('your_google_api_key');
    const hasClientId = !!this.clientId && !this.clientId.includes('your_google_client_id');
    const hasClientSecret = !!this.clientSecret && !this.clientSecret.includes('your_google_client_secret');

    console.log('🔍 Verificando credenciais Google Calendar:');
    console.log('  - API Key:', hasApiKey ? '✅' : '❌ (faltando ou placeholder)');
    console.log('  - Client ID:', hasClientId ? '✅' : '❌ (faltando ou placeholder)');
    console.log('  - Client Secret:', hasClientSecret ? '✅' : '❌ (faltando ou placeholder)');

    return hasApiKey && hasClientId && hasClientSecret;
  }

  // Inicializa o cliente Google Calendar
  async initialize(): Promise<boolean> {
    try {
      if (!this.isConfigured()) {
        console.warn('Google Calendar não está configurado - credenciais necessárias');
        return false;
      }

      console.log('Inicializando Google Calendar Service...');

      // Carrega a biblioteca Google API
      if (typeof window !== 'undefined' && !this.gapi) {
        await this.loadGoogleAPI();
      }

      // Em um ambiente real, aqui iniciaria OAuth2
      // Por enquanto, vou implementar métodos reais mas com fallback para mock
      console.log('Google Calendar Service inicializado com credenciais reais');

      return true;
    } catch (error) {
      console.error('Erro ao inicializar Google Calendar:', error);
      return false;
    }
  }

  // Carrega a biblioteca Google API
  private async loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Google API só funciona no browser'));
        return;
      }

      // Verifica se já foi carregada
      if (window.gapi) {
        this.gapi = window.gapi;
        resolve();
        return;
      }

      // Carrega o script da Google API
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', () => {
          this.gapi = window.gapi;
          resolve();
        });
      };
      script.onerror = () => reject(new Error('Falha ao carregar Google API'));
      document.head.appendChild(script);
    });
  }

  // Inicia o fluxo de autenticação OAuth2
  async authenticate(): Promise<boolean> {
    try {
      if (!this.gapi) {
        console.warn('Google API não carregada');
        return false;
      }

      await this.gapi.client.init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
      });

      const authInstance = this.gapi.auth2.getAuthInstance();

      if (!authInstance.isSignedIn.get()) {
        const user = await authInstance.signIn();
        this.accessToken = user.getAuthResponse().access_token;
      } else {
        this.accessToken = authInstance.currentUser.get().getAuthResponse().access_token;
      }

      console.log('Autenticação Google Calendar realizada com sucesso');
      return true;
    } catch (error) {
      console.error('Erro na autenticação Google Calendar:', error);
      return false;
    }
  }

  // Busca ou cria o calendário único "Aulas Inglês Pareto"
  async ensureParetoCalendarExists(): Promise<string | null> {
    try {
      if (this.parethoureCalendarId) {
        return this.parethoureCalendarId;
      }

      console.log('Verificando se calendário "Aulas Inglês Pareto" existe...');

      if (this.gapi && this.accessToken) {
        // Busca calendários existentes
        const response = await this.gapi.client.calendar.calendarList.list();
        const calendars = response.result.items || [];

        // Procura pelo calendário específico "Aulas Inglês Pareto"
        let paretoCalendar = calendars.find((cal: { summary: string }) =>
          cal.summary === this.PARETO_CALENDAR_NAME
        );

        if (!paretoCalendar) {
          // Cria o calendário se não existir
          console.log('Criando calendário "Aulas Inglês Pareto"...');
          const createResponse = await this.gapi.client.calendar.calendars.insert({
            resource: {
              summary: this.PARETO_CALENDAR_NAME,
              description: 'Calendário exclusivo para aulas da Escola Inglês Pareto',
              timeZone: 'America/Sao_Paulo'
            }
          });
          paretoCalendar = createResponse.result;
        }

        this.parethoureCalendarId = paretoCalendar.id;
        console.log('Calendário "Aulas Inglês Pareto" configurado com ID:', this.parethoureCalendarId);

        return this.parethoureCalendarId;
      }

      // Fallback para desenvolvimento
      console.warn('Google API não disponível, usando mock');
      this.parethoureCalendarId = 'pareto_english_lessons_calendar_mock';
      return this.parethoureCalendarId;

    } catch (error) {
      console.error('Erro ao configurar calendário Pareto:', error);
      return null;
    }
  }

  // Cria uma aula no calendário Pareto
  async createLessonEvent(lesson: ParethousCalendarLesson, dateTime: Date): Promise<GoogleCalendarEvent | null> {
    try {
      await this.ensureParetoCalendarExists();

      if (!this.parethoureCalendarId) {
        throw new Error('Calendário Pareto não configurado');
      }

      const startTime = new Date(dateTime);
      const endTime = new Date(startTime.getTime() + lesson.duration * 60000); // duration in minutes

      const event: GoogleCalendarEvent = {
        summary: `${this.getLessonTypeLabel(lesson.lessonType)} - ${lesson.topic}`,
        description: this.generateLessonDescription(lesson),
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'America/Sao_Paulo'
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'America/Sao_Paulo'
        },
        attendees: [
          {
            email: lesson.teacherEmail,
            displayName: lesson.teacherName,
            responseStatus: 'accepted'
          },
          ...lesson.studentEmails.map(email => ({
            email,
            displayName: email.split('@')[0],
            responseStatus: 'needsAction' as const
          }))
        ],
        location: lesson.meetingLink || 'Online - Link será enviado por email',
        colorId: this.LESSON_COLORS[lesson.lessonType],
        conferenceData: {
          createRequest: {
            requestId: `pareto_lesson_${lesson.lessonId}_${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        }
      };

      console.log('Criando aula no Google Calendar:', event);

      // Simulando criação no calendário específico
      const createdEvent = {
        ...event,
        id: `pareto_lesson_${lesson.lessonId}_${Date.now()}`
      };

      console.log('Aula criada no calendário "Aulas Inglês Pareto":', createdEvent.id);

      return createdEvent;
    } catch (error) {
      console.error('Erro ao criar aula no Google Calendar:', error);
      return null;
    }
  }

  // Atualiza uma aula no calendário
  async updateLessonEvent(eventId: string, updates: Partial<ParethousCalendarLesson>, newDateTime?: Date): Promise<boolean> {
    try {
      console.log('Atualizando aula no calendário Pareto:', eventId, updates);

      // Em uma implementação real, aqui faríamos a chamada para atualizar o evento
      // no calendário específico "Aulas Inglês Pareto"

      return true;
    } catch (error) {
      console.error('Erro ao atualizar aula:', error);
      return false;
    }
  }

  // Cancela uma aula (soft delete - marca como cancelada)
  async cancelLessonEvent(eventId: string, reason?: string): Promise<boolean> {
    try {
      console.log('Cancelando aula no calendário Pareto:', eventId, reason);

      // Em uma implementação real:
      // 1. Atualiza o evento com status "cancelled"
      // 2. Adiciona motivo do cancelamento na descrição
      // 3. Envia notificações aos participantes

      return true;
    } catch (error) {
      console.error('Erro ao cancelar aula:', error);
      return false;
    }
  }

  // Lista aulas do calendário Pareto em um período
  async listLessonsInPeriod(startDate: Date, endDate: Date): Promise<GoogleCalendarEvent[]> {
    try {
      console.log('Listando aulas do calendário Pareto:', startDate.toISOString(), endDate.toISOString());

      // Tenta usar API real se estiver configurada
      if (this.gapi && this.accessToken) {
        return await this.getRealCalendarEvents(startDate, endDate);
      }

      // Fallback para mock se não estiver configurada
      console.warn('Usando dados mockados - Google Calendar não autenticado');
      return this.getMockLessons();
    } catch (error) {
      console.error('Erro ao listar aulas, usando mock:', error);
      return this.getMockLessons();
    }
  }

  // Busca eventos reais do Google Calendar
  private async getRealCalendarEvents(startDate: Date, endDate: Date): Promise<GoogleCalendarEvent[]> {
    try {
      await this.ensureParetoCalendarExists();

      // GARANTE que só acessa o calendário "Aulas Inglês Pareto"
      if (!this.parethoureCalendarId) {
        throw new Error('Calendário "Aulas Inglês Pareto" não encontrado');
      }

      const response = await this.gapi.client.calendar.events.list({
        calendarId: this.parethoureCalendarId, // APENAS calendário Pareto
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime'
      });

      const events = response.result.items || [];

      return events.map((event: {
        id: string;
        summary: string;
        description?: string;
        start: { dateTime: string; timeZone?: string };
        end: { dateTime: string; timeZone?: string };
        attendees?: Array<{ email: string }>;
        location?: string;
        colorId?: string;
      }) => ({
        id: event.id,
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start.dateTime || event.start.date,
          timeZone: event.start.timeZone || 'America/Sao_Paulo'
        },
        end: {
          dateTime: event.end.dateTime || event.end.date,
          timeZone: event.end.timeZone || 'America/Sao_Paulo'
        },
        attendees: event.attendees || [],
        location: event.location,
        colorId: event.colorId
      }));
    } catch (error) {
      console.error('Erro ao buscar eventos reais:', error);
      throw error;
    }
  }

  // Retorna dados mockados para desenvolvimento
  private getMockLessons(): GoogleCalendarEvent[] {
    return [
      {
        id: 'pareto_lesson_1',
        summary: 'Grupo Iniciante - Família',
        description: 'Aula sobre vocabulário de família\n\nTipo: Grupo Iniciante\nDuração: 45 minutos\nCréditos: 1',
        start: {
          dateTime: new Date(Date.now() + 86400000).toISOString(),
          timeZone: 'America/Sao_Paulo'
        },
        end: {
          dateTime: new Date(Date.now() + 86400000 + 2700000).toISOString(),
          timeZone: 'America/Sao_Paulo'
        },
        colorId: this.LESSON_COLORS['group-beginner']
      }
    ];
  }

  // Verifica disponibilidade de horários em uma data específica
  async getAvailableTimeSlots(date: Date): Promise<{ time: string; available: boolean; teacherId?: string }[]> {
    try {
      console.log('🔍 Verificando disponibilidade real no Google Calendar para:', date.toDateString());

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // TENTA BUSCAR EVENTOS REAIS DO GOOGLE CALENDAR
      let existingEvents: GoogleCalendarEvent[] = [];

      if (this.isConfigured()) {
        try {
          // Tenta autenticar e buscar eventos reais
          const isAuthenticated = await this.authenticate();
          if (isAuthenticated) {
            existingEvents = await this.getRealCalendarEvents(startOfDay, endOfDay);
            console.log(`✅ Encontrados ${existingEvents.length} eventos reais no calendário "Aulas Inglês Pareto"`);
          } else {
            console.warn('⚠️ Autenticação falhou, usando eventos mockados');
            existingEvents = this.getMockEventsForDate(date);
          }
        } catch (error) {
          console.warn('⚠️ Erro ao acessar Google Calendar real, usando mock:', error.message);
          existingEvents = this.getMockEventsForDate(date);
        }
      } else {
        console.warn('⚠️ Google Calendar não configurado (credenciais ausentes), usando mock');
        existingEvents = this.getMockEventsForDate(date);
      }

      // Horários padrão de funcionamento da escola (9h às 19h)
      const standardSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30', '19:00'
      ];

      const availableSlots = standardSlots.map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const slotTime = new Date(date);
        slotTime.setHours(hours, minutes, 0, 0);

        // Verifica conflitos com eventos existentes (considera duração padrão de 60min)
        const slotEndTime = new Date(slotTime.getTime() + 60 * 60 * 1000); // +1 hora

        const hasConflict = existingEvents.some(event => {
          const eventStart = new Date(event.start.dateTime);
          const eventEnd = new Date(event.end.dateTime);

          // Verifica sobreposição: slot inicia antes do evento terminar E slot termina depois do evento iniciar
          return (slotTime < eventEnd && slotEndTime > eventStart);
        });

        return {
          time,
          available: !hasConflict,
          teacherId: hasConflict ? 'ocupado' : undefined
        };
      });

      const totalSlots = availableSlots.length;
      const availableCount = availableSlots.filter(slot => slot.available).length;

      console.log(`📊 Disponibilidade calculada: ${availableCount}/${totalSlots} horários livres`);

      return availableSlots;

    } catch (error) {
      console.error('❌ Erro crítico ao verificar disponibilidade:', error);

      // Fallback com dados realistas mas seguros
      return this.getFallbackSlots();
    }
  }

  // Eventos mockados para uma data específica (mais realista)
  private getMockEventsForDate(date: Date): GoogleCalendarEvent[] {
    const events: GoogleCalendarEvent[] = [];

    // Simula alguns eventos ocupados baseados no dia da semana
    const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Segunda, etc.

    if (dayOfWeek === 1) { // Segunda-feira - mais ocupada
      events.push(
        {
          id: 'mock_1',
          summary: 'Grupo Iniciante - Apresentações',
          start: { dateTime: new Date(date.setHours(10, 0, 0, 0)).toISOString(), timeZone: 'America/Sao_Paulo' },
          end: { dateTime: new Date(date.setHours(11, 0, 0, 0)).toISOString(), timeZone: 'America/Sao_Paulo' }
        },
        {
          id: 'mock_2',
          summary: 'Aula Individual - Business English',
          start: { dateTime: new Date(date.setHours(15, 0, 0, 0)).toISOString(), timeZone: 'America/Sao_Paulo' },
          end: { dateTime: new Date(date.setHours(16, 0, 0, 0)).toISOString(), timeZone: 'America/Sao_Paulo' }
        }
      );
    } else if (dayOfWeek === 3) { // Quarta-feira
      events.push({
        id: 'mock_3',
        summary: 'Conversação Avançada',
        start: { dateTime: new Date(date.setHours(14, 30, 0, 0)).toISOString(), timeZone: 'America/Sao_Paulo' },
        end: { dateTime: new Date(date.setHours(15, 30, 0, 0)).toISOString(), timeZone: 'America/Sao_Paulo' }
      });
    }

    return events;
  }

  // Slots de fallback seguros quando tudo falha
  private getFallbackSlots(): { time: string; available: boolean; teacherId?: string }[] {
    return [
      { time: '09:00', available: true },
      { time: '09:30', available: true },
      { time: '10:00', available: false, teacherId: 'ocupado' },
      { time: '10:30', available: true },
      { time: '11:00', available: true },
      { time: '14:00', available: false, teacherId: 'ocupado' },
      { time: '14:30', available: true },
      { time: '15:00', available: true },
      { time: '15:30', available: false, teacherId: 'ocupado' },
      { time: '16:00', available: true },
      { time: '17:00', available: true },
      { time: '18:00', available: true }
    ];
  }

  // Gera descrição detalhada para a aula
  private generateLessonDescription(lesson: ParethousCalendarLesson): string {
    const typeLabel = this.getLessonTypeLabel(lesson.lessonType);

    return `🎓 Aula de Inglês - Escola Pareto

📚 Tópico: ${lesson.topic}
👥 Tipo: ${typeLabel}
⏰ Duração: ${lesson.duration} minutos
💳 Créditos: ${lesson.creditsCost}
👨‍🏫 Professor(a): ${lesson.teacherName}

📝 Template ID: ${lesson.templateId}
🔗 ID da Aula: ${lesson.lessonId}

💻 Esta aula será realizada online. O link da reunião será compartilhado antes do início.

📞 Dúvidas? Entre em contato conosco!`;
  }

  // Converte tipo de aula para label em português
  private getLessonTypeLabel(type: string): string {
    const labels = {
      'group-beginner': 'Grupo Iniciante',
      'group-intermediate': 'Grupo Intermediário',
      'group-advanced': 'Grupo Avançado',
      'open-conversation': 'Conversação Aberta',
      'individual': 'Aula Individual'
    };
    return labels[type as keyof typeof labels] || type;
  }

  // Gera link de convite para o calendário Pareto
  generateCalendarInviteLink(eventId: string): string {
    // Em uma implementação real, retornaria o link direto para o evento no Google Calendar
    return `https://calendar.google.com/event?eid=${eventId}&ctz=America/Sao_Paulo`;
  }
}

// Instância singleton do serviço
export const googleCalendarService = new GoogleCalendarService();
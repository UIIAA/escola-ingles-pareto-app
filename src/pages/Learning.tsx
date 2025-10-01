import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Play,
  Award,
  Clock,
  Target,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Star,
  CheckCircle,
  PlayCircle,
  FileText,
  Headphones,
  PenTool,
  MessageSquare,
  Zap,
  Trophy,
  Calendar,
  Upload,
  Video,
  File,
  X,
  Link as LinkIcon,
  Plus
} from 'lucide-react';

import {
  LearningPath,
  UserProgress,
  DifficultyLevel,
  SkillType,
  ContentStatus,
  LEARNING_PATHS,
  ACHIEVEMENTS,
  getSkillLabel,
  getSkillColor,
  getLevelLabel,
  getLevelColor,
  getStatusColor,
  calculateProgress,
  formatDuration
} from '@/types/curriculum';

const Learning = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | 'all'>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillType | 'all'>('all');
  const [activeView, setActiveView] = useState<'paths' | 'progress' | 'achievements'>('paths');

  // Estados para upload de conteúdo
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Mock user progress
  const mockUserProgress: UserProgress = {
    userId: 'user-123',
    pathId: 'beginner-foundation',
    unitProgresses: [
      {
        unitId: 'unit-1-greetings',
        status: 'completed',
        completedContents: ['content-1', 'content-2', 'content-3'],
        assessmentScores: [{
          assessmentId: 'assess-1',
          score: 85,
          attempts: 1,
          completedAt: '2024-09-10T14:30:00Z'
        }],
        timeSpent: 120,
        startedAt: '2024-09-08T10:00:00Z',
        completedAt: '2024-09-10T14:30:00Z',
        notes: 'Great progress on greetings and introductions!'
      },
      {
        unitId: 'unit-2-family',
        status: 'in_progress',
        completedContents: ['content-4', 'content-5'],
        assessmentScores: [],
        timeSpent: 45,
        startedAt: '2024-09-11T09:00:00Z',
        notes: ''
      }
    ],
    overallProgress: {
      completedUnits: 1,
      totalUnits: 5,
      completedHours: 2,
      totalHours: 40,
      averageScore: 85,
      streak: 7,
      lastStudyDate: '2024-09-15T00:00:00Z'
    },
    achievements: [
      { ...ACHIEVEMENTS[0], unlockedAt: '2024-09-08T10:30:00Z' },
      { ...ACHIEVEMENTS[1], unlockedAt: '2024-09-14T20:00:00Z' }
    ],
    weakAreas: ['speaking', 'listening'],
    strengths: ['grammar', 'reading'],
    studyGoals: [
      {
        id: 'goal-1',
        type: 'daily',
        target: 30, // 30 minutos por dia
        current: 25,
        startDate: '2024-09-15T00:00:00Z',
        endDate: '2024-09-22T00:00:00Z',
        isActive: true
      }
    ]
  };

  // Filtrar trilhas de aprendizado
  const filteredPaths = useMemo(() => {
    let paths = LEARNING_PATHS;

    if (searchQuery.trim()) {
      paths = paths.filter(path =>
        path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLevel !== 'all') {
      paths = paths.filter(path => path.level === selectedLevel);
    }

    if (selectedSkill !== 'all') {
      paths = paths.filter(path => path.skills.includes(selectedSkill));
    }

    return paths;
  }, [searchQuery, selectedLevel, selectedSkill]);

  const handleStartPath = (pathId: string) => {
    console.log('Starting learning path:', pathId);

    // Store current path in localStorage for persistence
    localStorage.setItem('currentLearningPath', pathId);
    localStorage.setItem('currentLesson', '1'); // Start from first lesson
    localStorage.setItem('pathStartedAt', new Date().toISOString());

    // Find the selected path to get its details
    const selectedPath = LEARNING_PATHS.find(path => path.id === pathId);
    if (selectedPath) {
      localStorage.setItem('currentPathTitle', selectedPath.title);
    }

    // Scroll to top and show confirmation
    window.scrollTo({ top: 0, behavior: 'smooth' });

    toast({
      title: "✅ Trilha Iniciada!",
      description: `Você começou "${selectedPath?.title}". Em breve, as aulas estarão disponíveis aqui.`,
      duration: 5000,
    });
  };

  const handleContinuePath = () => {
    console.log('Continuing current path');

    // Get current path and lesson from localStorage
    const currentPath = localStorage.getItem('currentLearningPath') || 'beginner-foundation';
    const currentLesson = localStorage.getItem('currentLesson') || '1';
    const pathTitle = localStorage.getItem('currentPathTitle') || 'English Foundation';

    // Update last activity timestamp
    localStorage.setItem('lastStudySession', new Date().toISOString());

    // Scroll to progress section
    window.scrollTo({ top: 0, behavior: 'smooth' });

    toast({
      title: "📚 Continuando seus estudos",
      description: `Trilha: "${pathTitle}" - Lição ${currentLesson}. Em breve, você poderá acessar as aulas aqui.`,
      duration: 5000,
    });
  };

  // Lidar com seleção de arquivo de vídeo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo de vídeo válido (MP4, WebM, OGG, MOV).",
          variant: "destructive"
        });
        return;
      }

      // Validar tamanho (máximo 500MB)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 500MB. Para vídeos maiores, use a opção de URL.",
          variant: "destructive"
        });
        return;
      }

      setVideoFile(file);

      // Criar preview do vídeo
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);

      toast({
        title: "Arquivo selecionado",
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
      });
    }
  };

  // Validar URL de vídeo (YouTube, Vimeo, links diretos)
  const validateVideoUrl = (url: string): boolean => {
    if (!url) return false;

    // YouTube URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    if (youtubeRegex.test(url)) return true;

    // Vimeo URLs
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/\d+/;
    if (vimeoRegex.test(url)) return true;

    // Direct video URLs
    const directVideoRegex = /^https?:\/\/.+\.(mp4|webm|ogg|mov)$/i;
    if (directVideoRegex.test(url)) return true;

    return false;
  };

  // Converter URL do YouTube para embed
  const getYouTubeEmbedUrl = (url: string): string => {
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // Converter para: https://www.youtube.com/embed/VIDEO_ID

    let videoId = '';

    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // Upload de vídeo
  const handleUploadVideo = async () => {
    // Validações
    if (!videoTitle.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para o vídeo.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPath) {
      toast({
        title: "Trilha obrigatória",
        description: "Por favor, selecione a trilha onde o vídeo será adicionado.",
        variant: "destructive"
      });
      return;
    }

    if (uploadType === 'file' && !videoFile) {
      toast({
        title: "Arquivo obrigatório",
        description: "Por favor, selecione um arquivo de vídeo.",
        variant: "destructive"
      });
      return;
    }

    if (uploadType === 'url') {
      if (!videoUrl.trim()) {
        toast({
          title: "URL obrigatória",
          description: "Por favor, insira a URL do vídeo.",
          variant: "destructive"
        });
        return;
      }

      if (!validateVideoUrl(videoUrl)) {
        toast({
          title: "URL inválida",
          description: "Por favor, insira uma URL válida do YouTube, Vimeo ou link direto de vídeo.",
          variant: "destructive"
        });
        return;
      }
    }

    setIsUploading(true);

    try {
      // Simular upload (em produção, usar Supabase Storage)
      await new Promise(resolve => setTimeout(resolve, 2000));

      let finalVideoUrl = '';

      if (uploadType === 'file' && videoFile) {
        // Em produção: Upload para Supabase Storage
        // const { data, error } = await supabase.storage
        //   .from('learning-videos')
        //   .upload(`videos/${Date.now()}-${videoFile.name}`, videoFile);
        //
        // if (error) throw error;
        // finalVideoUrl = data.path;

        // Mock URL para demonstração
        finalVideoUrl = `https://storage.supabase.co/learning-videos/${Date.now()}-${videoFile.name}`;
      } else {
        finalVideoUrl = videoUrl;
      }

      // Em produção: Salvar no banco de dados
      // const contentItem = {
      //   title: videoTitle,
      //   description: videoDescription,
      //   type: 'video',
      //   pathId: selectedPath,
      //   content: {
      //     videoUrl: finalVideoUrl,
      //     duration: 0, // Calcular duração real
      //   },
      //   createdAt: new Date().toISOString()
      // };
      //
      // await supabase.from('learning_content').insert(contentItem);

      toast({
        title: "✅ Vídeo adicionado com sucesso!",
        description: `"${videoTitle}" foi adicionado à trilha selecionada.`,
      });

      // Resetar formulário
      setUploadDialogOpen(false);
      setVideoFile(null);
      setVideoUrl('');
      setVideoTitle('');
      setVideoDescription('');
      setSelectedPath('');
      setVideoPreview(null);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload do vídeo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Limpar preview quando mudar de tipo
  React.useEffect(() => {
    if (videoPreview) {
      return () => URL.revokeObjectURL(videoPreview);
    }
  }, [videoPreview]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="text-blue-600" />
            Centro de Aprendizado
          </h1>
          <p className="text-gray-600 mt-2">
            Trilhas estruturadas, conteúdo interativo e acompanhamento de progresso
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                <Upload className="w-4 h-4 mr-2" />
                Adicionar Conteúdo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-600" />
                  Adicionar Vídeo à Trilha de Aprendizado
                </DialogTitle>
                <DialogDescription>
                  Faça upload de um vídeo ou adicione um link do YouTube/Vimeo
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Tipo de Upload */}
                <Tabs value={uploadType} onValueChange={(v) => setUploadType(v as 'file' | 'url')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="file">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload de Arquivo
                    </TabsTrigger>
                    <TabsTrigger value="url">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      URL (YouTube/Vimeo)
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="file" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Arquivo de Vídeo</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="video-upload"
                        />
                        <label htmlFor="video-upload" className="cursor-pointer">
                          {videoFile ? (
                            <div className="space-y-2">
                              <File className="w-12 h-12 mx-auto text-green-600" />
                              <p className="font-medium">{videoFile.name}</p>
                              <p className="text-sm text-gray-500">
                                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                              <Button type="button" variant="outline" size="sm" onClick={() => {
                                setVideoFile(null);
                                setVideoPreview(null);
                              }}>
                                <X className="w-4 h-4 mr-1" />
                                Remover
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="w-12 h-12 mx-auto text-gray-400" />
                              <p className="font-medium">Clique para selecionar um vídeo</p>
                              <p className="text-sm text-gray-500">
                                MP4, WebM, OGG ou MOV (máx. 500MB)
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Preview do vídeo */}
                    {videoPreview && (
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <video
                          src={videoPreview}
                          controls
                          className="w-full rounded-lg border"
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="video-url">URL do Vídeo</Label>
                      <Input
                        id="video-url"
                        placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Suporta: YouTube, Vimeo ou links diretos para arquivos de vídeo
                      </p>
                    </div>

                    {/* Preview para URLs do YouTube */}
                    {videoUrl && validateVideoUrl(videoUrl) && (videoUrl.includes('youtube') || videoUrl.includes('youtu.be')) && (
                      <div className="space-y-2">
                        <Label>Preview do YouTube</Label>
                        <div className="aspect-video rounded-lg border overflow-hidden bg-black">
                          <iframe
                            src={getYouTubeEmbedUrl(videoUrl)}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="YouTube video preview"
                          />
                        </div>
                      </div>
                    )}

                    {/* Preview para links diretos */}
                    {videoUrl && validateVideoUrl(videoUrl) && !videoUrl.includes('youtube') && !videoUrl.includes('youtu.be') && !videoUrl.includes('vimeo') && (
                      <div className="space-y-2">
                        <Label>Preview do Vídeo</Label>
                        <video
                          src={videoUrl}
                          controls
                          className="w-full rounded-lg border"
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Campos comuns */}
                <div className="space-y-2">
                  <Label htmlFor="video-title">Título do Vídeo *</Label>
                  <Input
                    id="video-title"
                    placeholder="Ex: Introduction to English Tenses"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-description">Descrição (Opcional)</Label>
                  <Textarea
                    id="video-description"
                    placeholder="Descreva o conteúdo do vídeo e o que os alunos aprenderão..."
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="path-select">Trilha de Aprendizado *</Label>
                  <Select value={selectedPath} onValueChange={setSelectedPath}>
                    <SelectTrigger id="path-select">
                      <SelectValue placeholder="Selecione a trilha" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEARNING_PATHS.map(path => (
                        <SelectItem key={path.id} value={path.id}>
                          {path.title} ({getLevelLabel(path.level)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUploadVideo}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Vídeo
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant={activeView === 'paths' ? 'default' : 'outline'}
            onClick={() => setActiveView('paths')}
          >
            <BookOpen className="w-4 h-4 mr-1" />
            Trilhas
          </Button>
          <Button
            variant={activeView === 'progress' ? 'default' : 'outline'}
            onClick={() => setActiveView('progress')}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Progresso
          </Button>
          <Button
            variant={activeView === 'achievements' ? 'default' : 'outline'}
            onClick={() => setActiveView('achievements')}
          >
            <Award className="w-4 h-4 mr-1" />
            Conquistas
          </Button>
        </div>
      </div>

      {/* Current Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Sua Trilha Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">English Foundation - Beginner</h3>
                <p className="text-sm text-gray-600">Unidade atual: Family & Relationships</p>
              </div>

              <Progress value={20} className="h-2" />

              <div className="flex items-center justify-between text-sm">
                <span>Progresso: {mockUserProgress.overallProgress.completedUnits}/{mockUserProgress.overallProgress.totalUnits} unidades</span>
                <span>{calculateProgress(mockUserProgress.overallProgress.completedUnits, mockUserProgress.overallProgress.totalUnits)}%</span>
              </div>

              <Button onClick={handleContinuePath} className="w-full">
                <PlayCircle className="w-4 h-4 mr-2" />
                Continuar Estudos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-orange-600" />
              Sequência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 flex items-center justify-center gap-1">
                🔥 {mockUserProgress.overallProgress.streak}
              </div>
              <p className="text-sm text-gray-600 mt-1">dias consecutivos</p>
              <p className="text-xs text-gray-500 mt-2">Continue hoje para manter a sequência!</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-green-600" />
              Tempo de Estudo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatDuration(mockUserProgress.overallProgress.completedHours * 60)}
              </div>
              <p className="text-sm text-gray-600 mt-1">de {mockUserProgress.overallProgress.totalHours}h totais</p>

              {/* Daily Goal Progress */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Meta diária</span>
                  <span>{mockUserProgress.studyGoals[0].current}/{mockUserProgress.studyGoals[0].target}min</span>
                </div>
                <Progress
                  value={(mockUserProgress.studyGoals[0].current / mockUserProgress.studyGoals[0].target) * 100}
                  className="h-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content based on active view */}
      {activeView === 'paths' && (
        <div>
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Explorar Trilhas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar trilhas de aprendizado..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as DifficultyLevel | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Níveis</SelectItem>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedSkill} onValueChange={(value) => setSelectedSkill(value as SkillType | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Habilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Habilidades</SelectItem>
                    <SelectItem value="grammar">Grammar</SelectItem>
                    <SelectItem value="vocabulary">Vocabulary</SelectItem>
                    <SelectItem value="listening">Listening</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Learning Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className={getLevelColor(path.level)} variant="outline">
                        {getLevelLabel(path.level)}
                      </Badge>
                      <CardTitle className="text-lg mt-2">{path.title}</CardTitle>
                    </div>
                    {path.certification && (
                      <Trophy className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {path.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {path.skills.map(skill => (
                      <Badge key={skill} className={getSkillColor(skill)} variant="outline">
                        {getSkillLabel(skill)}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{path.totalDuration}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span>{path.units.length} unidades</span>
                    </div>
                  </div>

                  {/* Objectives Preview */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Você vai aprender:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {path.objectives.slice(0, 2).map((objective, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      ))}
                      {path.objectives.length > 2 && (
                        <li className="text-xs text-gray-500">
                          +{path.objectives.length - 2} outros objetivos...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleStartPath(path.id)}
                      className="flex-1"
                      variant={mockUserProgress.pathId === path.id ? 'outline' : 'default'}
                    >
                      {mockUserProgress.pathId === path.id ? (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Continuar
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-1" />
                          Iniciar Trilha
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeView === 'progress' && (
        <div className="space-y-6">
          {/* Skills Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Progresso por Habilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(['grammar', 'vocabulary', 'listening', 'speaking', 'reading', 'writing'] as SkillType[]).map(skill => {
                  const isStrength = mockUserProgress.strengths.includes(skill);
                  const isWeak = mockUserProgress.weakAreas.includes(skill);
                  const progress = isStrength ? 85 : isWeak ? 45 : 65;

                  return (
                    <div key={skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{getSkillLabel(skill)}</span>
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      {isStrength && <Badge variant="outline" className="text-xs text-green-600">💪 Ponto forte</Badge>}
                      {isWeak && <Badge variant="outline" className="text-xs text-orange-600">🎯 Foco</Badge>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Unidade "Greetings" concluída</p>
                    <p className="text-xs text-gray-600">Nota: 85% • 2 horas atrás</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <PlayCircle className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Iniciou unidade "Family"</p>
                    <p className="text-xs text-gray-600">Progresso: 60% • 1 dia atrás</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeView === 'achievements' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suas Conquistas</CardTitle>
              <CardDescription>
                {mockUserProgress.achievements.length} de {ACHIEVEMENTS.length} conquistas desbloqueadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACHIEVEMENTS.map(achievement => {
                  const isUnlocked = mockUserProgress.achievements.some(a => a.id === achievement.id);

                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        isUnlocked
                          ? 'border-yellow-200 bg-yellow-50'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-3xl">{achievement.icon}</div>
                        <h3 className="font-semibold text-sm">{achievement.title}</h3>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {achievement.requirement}
                        </Badge>
                        {isUnlocked && (
                          <p className="text-xs text-green-600">
                            ✅ Desbloqueada em{' '}
                            {new Date(mockUserProgress.achievements.find(a => a.id === achievement.id)!.unlockedAt!).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Learning;
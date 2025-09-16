
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Play, Star, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Materials = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const materials = [
    {
      id: 1,
      title: 'Guia de Conversação do Dia a Dia',
      description: 'Aprenda frases essenciais para situações cotidianas...',
      duration: '15 min',
      size: '2.3 MB',
      rating: 4.8,
      instructor: 'Prof. Carlos Silva',
      progress: 100,
      tags: ['conversação', 'básico', 'frases'],
      type: 'completed',
      icon: '📚'
    },
    {
      id: 2,
      title: 'Pronúncia Perfeita - Curso Completo',
      description: 'Curso completo com exercícios de pronúncia e áudios...',
      duration: '40 min',
      size: '15 MB',
      rating: 4.9,
      instructor: 'Prof. Ana Costa',
      progress: 65,
      tags: ['pronúncia', 'áudio', 'avançado'],
      type: 'in-progress',
      icon: '🎵'
    },
    {
      id: 3,
      title: 'Vocabulário de Negócios',
      description: 'Termos e expressões essenciais para o ambiente...',
      duration: '20 min',
      size: '7.1 MB',
      rating: 4.7,
      instructor: 'Prof. Roberto Santos',
      progress: 30,
      tags: ['negócios', 'vocabulário', 'corporativo'],
      type: 'premium',
      icon: '💼'
    },
    {
      id: 4,
      title: 'Exercícios de Listening - Nível Intermediário',
      description: 'Série de exercícios para melhorar sua compreensão...',
      duration: '30 min',
      size: '4.0 MB',
      rating: 4.6,
      instructor: 'Prof. Maria Oliveira',
      progress: 0,
      tags: ['listening', 'áudio', 'intermediário'],
      type: 'available',
      icon: '🎧'
    },
    {
      id: 5,
      title: 'Gramática Prática - Verbos Irregulares',
      description: 'Guia completo com os verbos irregulares mais usados...',
      duration: '25 min',
      size: '1.8 MB',
      rating: 4.5,
      instructor: 'Prof. João Pereira',
      progress: 85,
      tags: ['gramática', 'verbos', 'exercícios'],
      type: 'in-progress',
      icon: '📝'
    }
  ];

  const stats = [
    { label: 'Concluídos', value: '1', color: 'text-green-400' },
    { label: 'Em Andamento', value: '3', color: 'text-blue-400' },
    { label: 'Premium', value: '2', color: 'text-yellow-400' }
  ];

  const tabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'continuar', label: 'Continuar' },
    { id: 'completos', label: 'Completos' },
    { id: 'premium', label: 'Premium' }
  ];

  const handleAction = (action, material) => {
    toast({
      title: `${action} - ${material.title}`,
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'todos') return matchesSearch;
    if (activeTab === 'continuar') return matchesSearch && material.type === 'in-progress';
    if (activeTab === 'completos') return matchesSearch && material.type === 'completed';
    if (activeTab === 'premium') return matchesSearch && material.type === 'premium';
    
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Materiais de Estudo</h1>
        <p className="text-white/70 text-lg">Acesse conteúdo exclusivo para acelerar seu aprendizado</p>
        
        {/* Stats */}
        <div className="flex gap-8 mt-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
            <input
              type="text"
              placeholder="Buscar materiais, tags ou autores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => toast({ title: "🔍 Filtros", description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" })}
              className="text-white hover:bg-white/10"
            >
              <Filter size={20} className="mr-2" />
              Todos
            </Button>
            <Button
              variant="ghost"
              onClick={() => toast({ title: "🔍 Filtros", description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" })}
              className="text-white hover:bg-white/10"
            >
              Todos
            </Button>
            <Button
              variant="ghost"
              onClick={() => toast({ title: "🔍 Filtros", description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" })}
              className="text-white hover:bg-white/10"
            >
              Todos
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-1 bg-white/10 rounded-lg p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-900 shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMaterials.map((material, index) => (
          <motion.div
            key={material.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="glass-effect rounded-2xl p-6 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{material.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{material.title}</h3>
                  <p className="text-white/60 text-sm">{material.description}</p>
                </div>
              </div>
              {material.type === 'premium' && (
                <Star className="text-yellow-400" size={20} />
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{material.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download size={16} />
                <span>{material.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400" />
                <span>{material.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{material.instructor}</span>
              </div>
            </div>

            {material.progress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Progresso</span>
                  <span>{material.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="progress-bar h-2 rounded-full transition-all duration-500"
                    style={{ width: `${material.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {material.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className={`tag-${tag.replace(/[^a-z]/g, '')} text-xs`}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              {material.progress === 100 ? (
                <Button
                  onClick={() => handleAction('Revisar', material)}
                  className="btn-secondary flex-1"
                >
                  <Play size={16} className="mr-2" />
                  Revisar
                </Button>
              ) : material.progress > 0 ? (
                <Button
                  onClick={() => handleAction('Continuar', material)}
                  className="btn-primary flex-1"
                >
                  Continuar
                </Button>
              ) : (
                <Button
                  onClick={() => handleAction('Começar', material)}
                  className="btn-primary flex-1"
                >
                  <Play size={16} className="mr-2" />
                  Começar
                </Button>
              )}
              
              <Button
                onClick={() => handleAction('Download', material)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Download size={16} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Materials;


import React from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const Forum = () => {
  React.useEffect(() => {
    toast({
      title: "👥 Fórum da Comunidade",
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-8 text-center"
    >
      <h1 className="text-3xl font-bold text-white mb-4">Fórum</h1>
      <p className="text-white/70 text-lg">
        Conecte-se com outros estudantes e compartilhe experiências!
      </p>
    </motion.div>
  );
};

export default Forum;

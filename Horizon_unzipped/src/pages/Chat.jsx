
import React from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const Chat = () => {
  React.useEffect(() => {
    toast({
      title: "💬 Chat com IA",
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-8 text-center"
    >
      <h1 className="text-3xl font-bold text-white mb-4">Chat com IA</h1>
      <p className="text-white/70 text-lg">
        Converse com nossa IA para tirar dúvidas e praticar!
      </p>
    </motion.div>
  );
};

export default Chat;

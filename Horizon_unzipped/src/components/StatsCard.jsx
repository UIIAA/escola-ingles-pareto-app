
import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color, change }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-effect rounded-2xl p-6 card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-white/60 text-sm">{change}</div>
        </div>
      </div>
      <h3 className="text-white/80 font-medium">{title}</h3>
    </motion.div>
  );
};

export default StatsCard;

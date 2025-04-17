import { useState } from 'react';
import { motion } from 'framer-motion';
import { getTechIcon } from '../../../utils/iconUtils';
import { TechCardProps } from '../../../types/techCard.types';

const DraggableTechCard = ({ id, name, icon, url, darkMode }: TechCardProps) => {
  // Colores aleatorios para las tarjetas
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-400 to-emerald-500',
    'from-amber-400 to-orange-500',
    'from-indigo-500 to-purple-500',
    'from-rose-400 to-red-500',
    'from-teal-400 to-cyan-500',
    'from-fuchsia-400 to-pink-500',
  ];
  
  const randomColor = colors[id % colors.length];

  // Genera una animación de flotación ligeramente diferente para cada tarjeta
  const floatDuration = 2 + Math.random() * 2;
  const floatDelay = Math.random() * 1.5;
  const floatDistance = -3 - Math.random() * 5;
  
  // Sombra adaptativa según el tema
  const hoverShadow = darkMode 
    ? '0px 15px 30px rgba(255, 255, 255, 0.15)' // Sombra clara en modo oscuro
    : '0px 15px 30px rgba(0, 0, 0, 0.25)';      // Sombra oscura en modo claro
    
  const defaultShadow = darkMode
    ? '0 4px 12px rgba(255, 255, 255, 0.08)'    // Sombra clara sutil en modo oscuro
    : '0 4px 12px rgba(0, 0, 0, 0.15)';         // Sombra oscura sutil en modo claro

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ 
        scale: 1.12,
        boxShadow: hoverShadow,
        rotateZ: Math.random() > 0.5 ? 3 : -3,
        zIndex: 10,
        transition: {
          duration: 0.1, // Transición más rápida (reducida de 0.2 a 0.1)
          ease: "easeOut"
        }
      }}
      initial={{ 
        opacity: 0, 
        scale: 0.8, 
        y: 20 
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, floatDistance, 0],
        transition: {
          opacity: { duration: 0.5 },
          scale: { duration: 0.5 },
          y: {
            delay: floatDelay,
            duration: floatDuration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }
      }}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 m-2
        bg-gradient-to-br ${randomColor} ${darkMode ? 'border-gray-600' : 'border-gray-200'}
        transition-all duration-200 relative
      `}
      style={{ 
        boxShadow: defaultShadow,
      }}
    >
      {/* Efecto de resplandor al hacer hover */}
      <div className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-br ${
        darkMode 
          ? 'from-white to-transparent opacity-0 group-hover:opacity-20' 
          : 'from-white to-transparent opacity-0 group-hover:opacity-30'
      } blur-xl transition-opacity duration-200`}></div>
      
      <div className="flex items-center justify-center bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 p-2 rounded-lg shadow-inner">
        {icon ? getTechIcon(icon, darkMode, 28) : (
          <div className="w-7 h-7 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <span className="font-medium text-white drop-shadow-md">{name}</span>
    </motion.a>
  );
};

export default DraggableTechCard;
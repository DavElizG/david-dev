import { memo } from 'react';
import { getTechIcon } from '../../../utils/iconUtils';
import { TechCardProps } from '../../../types/techCard.types';

// Usando memo para prevenir re-renderizados innecesarios
const DraggableTechCard = memo(({ id, name, icon, url, darkMode }: TechCardProps) => {
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

  // Simplificamos las animaciones usando CSS en lugar de framer-motion
  // para las animaciones básicas, reduciendo el tamaño del bundle
    
  const animationDelay = `${Math.random() * 2}s`;
  const animationDuration = `${3 + Math.random() * 2}s`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 m-2
        bg-gradient-to-br ${randomColor}
        hover:scale-110 hover:-rotate-1 hover:z-10
        transition-all duration-150 relative
        animate-float
      `}
      style={{
        animationDelay,
        animationDuration,
        borderColor: 'rgba(168, 85, 247, 0.3)',
      }}
    >
      {/* Efecto de resplandor al hacer hover */}
      <div className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-br ${
        darkMode 
          ? 'from-white to-transparent opacity-0 group-hover:opacity-20' 
          : 'from-white to-transparent opacity-0 group-hover:opacity-30'
      } blur-xl transition-opacity duration-200`}></div>
      
      <div className="flex items-center justify-center bg-white/15 p-2 rounded-lg shadow-inner">
        {icon ? getTechIcon(icon, darkMode, 28) : (
          <div className="w-7 h-7 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <span className="font-medium text-white drop-shadow-md">{name}</span>
    </a>
  );
});

// Añadir displayName para herramientas de desarrollo
DraggableTechCard.displayName = 'DraggableTechCard';

export default DraggableTechCard;
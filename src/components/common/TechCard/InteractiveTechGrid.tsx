import { useRef } from 'react';
import { motion } from 'framer-motion';
import { DraggableTechCard } from './';
import { InteractiveTechGridProps } from '../../../types/techCard.types';

const InteractiveTechGrid = ({ techItems, darkMode }: InteractiveTechGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Verificamos si hay datos para mostrar
  const hasTechItems = techItems && techItems.length > 0;

  return (
    <motion.div 
      className="relative w-full py-8"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {hasTechItems ? (
        <div className="flex flex-wrap justify-center gap-3 relative z-10 py-4">
          {techItems.map((tech) => (
            <DraggableTechCard
              key={tech.id_tech}
              id={tech.id_tech}
              name={tech.name}
              icon={tech.icon}
              url={tech.url}
              darkMode={darkMode}
            />
          ))}
        </div>
      ) : (
        <div className="min-h-[200px] flex items-center justify-center">
          <p className={darkMode ? "text-white" : "text-gray-700"}>
            No se encontraron tecnologías para mostrar.
          </p>
        </div>
      )}
      
      {hasTechItems && (
        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Haz clic en cualquier tecnología para visitar su documentación oficial
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InteractiveTechGrid;
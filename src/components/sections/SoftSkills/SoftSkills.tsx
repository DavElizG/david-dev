import React, { useState } from 'react';
import { useSoftSkills } from '../../../hooks';
import { useTheme } from '../../../context';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaComments, 
  FaPuzzlePiece, 
  FaSync, 
  FaClock, 
  FaBrain
} from 'react-icons/fa';

// Colores para las tarjetas de habilidades blandas
const cardColors = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-400 to-emerald-500',
  'from-amber-400 to-orange-500',
  'from-indigo-500 to-purple-500',
  'from-rose-400 to-red-500',
  'from-teal-400 to-cyan-500',
  'from-fuchsia-400 to-pink-500',
];

// Mapeo de iconos para las habilidades blandas
const iconMapper: Record<string, JSX.Element> = {
  "Trabajo en equipo": <FaUsers className="w-10 h-10" />,
  "Comunicación efectiva": <FaComments className="w-10 h-10" />,
  "Resolución de problemas": <FaPuzzlePiece className="w-10 h-10" />,
  "Adaptabilidad": <FaSync className="w-10 h-10" />,
  "Gestión del tiempo": <FaClock className="w-10 h-10" />,
  "Pensamiento crítico": <FaBrain className="w-10 h-10" />
};

// Componente de esqueleto para el estado de carga
const SkillSkeleton: React.FC = () => (
  <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
    <div className="h-full min-h-[200px] bg-gray-200 rounded-lg flex flex-col items-center justify-center p-6 animate-pulse">
      <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/4"></div>
    </div>
  </div>
);

const SoftSkills: React.FC = () => {
  const { softSkills, loading: softSkillsLoading } = useSoftSkills();
  const { darkMode } = useTheme();
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);

  const handleClick = (id: number) => {
    setSelectedSkill(selectedSkill === id ? null : id);
  };

  // Sombra adaptativa según el tema
  const getHoverShadow = () => darkMode 
    ? '0px 15px 30px rgba(255, 255, 255, 0.15)'
    : '0px 15px 30px rgba(0, 0, 0, 0.25)';
    
  const getDefaultShadow = () => darkMode
    ? '0 4px 12px rgba(255, 255, 255, 0.08)'
    : '0 4px 12px rgba(0, 0, 0, 0.15)';

  return (
    <section id="soft-skills" className={`py-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Habilidades Blandas
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center -m-4">
          {softSkillsLoading ? (
            // Mostrar esqueletos durante la carga
            Array.from({ length: 6 }).map((_, index) => (
              <SkillSkeleton key={index} />
            ))
          ) : (
            // Mostrar tarjetas de habilidades
            softSkills?.map((skill) => {
              const isSelected = selectedSkill === skill.id;
              const randomColor = cardColors[skill.id % cardColors.length];
              
              // Genera una animación de flotación ligeramente diferente para cada tarjeta
              const floatDuration = 2 + Math.random() * 2;
              const floatDelay = Math.random() * 1.5;
              const floatDistance = -3 - Math.random() * 5;
              
              return (
                <div
                  key={skill.id}
                  className="p-4 md:w-1/3 sm:w-1/2 w-full"
                >
                  {!isSelected ? (
                    // Tarjeta frontal (icono y nombre)
                    <motion.div
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
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: getHoverShadow(),
                      }}
                      onClick={() => handleClick(skill.id)}
                      className={`w-full h-full min-h-[200px] cursor-pointer flex flex-col items-center justify-center text-center
                        rounded-xl border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}
                        bg-gradient-to-br ${randomColor} p-6`}
                      style={{ boxShadow: getDefaultShadow() }}
                    >
                      {/* Icono sin caja */}
                      <div className="text-white mb-4">
                        {iconMapper[skill.name] || <FaUsers className="w-10 h-10" />}
                      </div>
                      <h3 className="text-xl font-semibold text-white drop-shadow-md">
                        {skill.name}
                      </h3>
                    </motion.div>
                  ) : (
                    // Tarjeta trasera (descripción)
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => handleClick(skill.id)}
                      className={`w-full h-full min-h-[200px] cursor-pointer
                        rounded-xl border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'} 
                        bg-gradient-to-br ${randomColor} p-6 flex items-center justify-center`}
                      style={{ boxShadow: getHoverShadow() }}
                    >
                      {/* Contenedor para la descripción */}
                      <div className="text-center">
                        <p className="text-base text-white font-medium leading-relaxed">
                          {skill.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Haz clic en cualquier habilidad para ver su descripción
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SoftSkills;
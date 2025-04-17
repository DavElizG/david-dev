import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { getTechIcon, getTechDocUrl } from '../../../utils/iconUtils';
import { ProjectCardProps } from '../../../types/projects.types';

const ProjectCard = ({
  id,
  title,
  description,
  technologies,
  repoUrl,
  liveUrl,
  darkMode,
  image
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Colores de gradiente para las tarjetas (diferentes según el ID)
  const gradients = [
    'from-blue-600 to-indigo-700',
    'from-purple-600 to-pink-700',
    'from-emerald-600 to-teal-700',
    'from-amber-600 to-orange-700',
    'from-rose-600 to-red-700',
    'from-cyan-600 to-blue-700'
  ];

  const selectedGradient = gradients[id % gradients.length];
  
  // Sombras adaptativas según el tema (similares a las de las tarjetas de tecnologías)
  const hoverShadow = darkMode 
    ? '0px 20px 40px rgba(255, 255, 255, 0.1), 0px 5px 20px rgba(120, 120, 255, 0.1)' // Sombra clara en modo oscuro
    : '0px 20px 40px rgba(0, 0, 0, 0.15), 0px 5px 20px rgba(0, 0, 150, 0.07)';        // Sombra oscura en modo claro
    
  const defaultShadow = darkMode
    ? '0 8px 20px rgba(255, 255, 255, 0.05), 0px 2px 10px rgba(30, 30, 255, 0.05)'    // Sombra clara sutil en modo oscuro
    : '0 8px 20px rgba(0, 0, 0, 0.1), 0px 2px 10px rgba(0, 0, 150, 0.03)';            // Sombra oscura sutil en modo claro

  // Verificar si es el proyecto de CTP La Mansión
  const isCtpProject = title.toLowerCase().includes('ctp la mansión') || 
                        title.toLowerCase().includes('ctp la mansion') || 
                        description.toLowerCase().includes('ctp la mansión');

  return (
    <motion.div
      className={`flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300
        ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}
      whileHover={{
        scale: 1.02,
        boxShadow: hoverShadow,
        transition: { duration: 0.2 }
      }}
      style={{ boxShadow: defaultShadow }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cabecera con imagen o gradiente */}
      <div className={`relative h-48 overflow-hidden ${!image ? `bg-gradient-to-br ${selectedGradient}` : ''}`}>
        {image || isCtpProject ? (
          <>
            {/* Imagen de previsualización */}
            <img 
              src={image || '/assets/images/projects/ctp-preview.webp'} 
              alt={`Previsualización de ${title}`}
              className="w-full h-full object-cover object-center"
            />
            
            {/* Capa de gradiente sobre la imagen */}
            <div className={`absolute inset-0 bg-gradient-to-br ${selectedGradient} opacity-70`}></div>
            
            {/* Título del proyecto en la cabecera */}
            <div className="absolute inset-0 flex items-center justify-center text-center p-4 z-10">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">{title}</h3>
            </div>
          </>
        ) : (
          <>
            {/* Título del proyecto en la cabecera */}
            <div className="absolute inset-0 flex items-center justify-center text-center p-4">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">{title}</h3>
            </div>
            
            {/* Efecto de patrón de fondo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" 
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
                    backgroundSize: '24px 24px'
                  }}>
              </div>
            </div>
          </>
        )}
        
        {/* Efecto de iluminación */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.15 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Contenido del proyecto */}
      <div className="flex flex-col flex-grow p-6">
        {/* Descripción */}
        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
        
        {/* Tecnologías */}
        <div className="flex flex-wrap gap-2 mb-6">
          {technologies.map((tech, index) => (
            <motion.button 
              key={index}
              onClick={() => window.open(getTechDocUrl(tech), '_blank', 'noopener,noreferrer')}
              className={`flex items-center px-3 py-1 text-sm rounded-full
                ${darkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              whileHover={{ 
                scale: 1.05,
                boxShadow: darkMode 
                  ? '0 3px 10px rgba(255, 255, 255, 0.1)' 
                  : '0 3px 10px rgba(0, 0, 0, 0.1)'
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="mr-1.5">
                {getTechIcon(tech, darkMode, 20)}
              </span>
              {tech}
            </motion.button>
          ))}
        </div>
        
        {/* Espaciador que empuja los botones hacia abajo */}
        <div className="flex-grow"></div>
        
        {/* Enlaces - Siempre al final de la tarjeta */}
        <div className="flex justify-between mt-4 pt-4 border-t border-gray-700/30">
          <motion.a 
            href={repoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center transition-colors
              ${darkMode 
                ? 'text-gray-300 hover:text-blue-400' 
                : 'text-gray-700 hover:text-blue-600'}`}
            whileHover={{ 
              scale: 1.05,
              textShadow: darkMode 
                ? '0 0 8px rgba(120, 160, 255, 0.5)' 
                : '0 0 8px rgba(0, 90, 255, 0.3)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <FaGithub className="mr-2" /> 
            <span>Repositorio</span>
          </motion.a>
          <motion.a 
            href={liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center transition-colors
              ${darkMode 
                ? 'text-gray-300 hover:text-blue-400' 
                : 'text-gray-700 hover:text-blue-600'}`}
            whileHover={{ 
              scale: 1.05,
              textShadow: darkMode 
                ? '0 0 8px rgba(120, 160, 255, 0.5)' 
                : '0 0 8px rgba(0, 90, 255, 0.3)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span>Demo</span>
            <FaExternalLinkAlt className="ml-2" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
import { useTheme } from '../../../context';
import { useSkills } from '../../../hooks';
import { getTechIcon, getTechDocUrl } from '../../../utils/iconUtils';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface TechSkillsProps {
  isLoading?: boolean;
}

// Función para asignar porcentajes realistas basados en la experiencia actual
const getSkillPercentage = (techId: number, name: string): number => {
  // Normalizamos el nombre para comparaciones
  const normalizedName = name.toLowerCase();
  
  // Tecnologías backend con mayor dominio
  if (normalizedName.includes('.net') || normalizedName.includes('dotnet') || normalizedName.includes('c#')) {
    return 70; // .NET - Mayor dominio
  }
  
  // Bases de datos
  if (normalizedName.includes('sql server') || normalizedName.includes('sqlserver')) {
    return 70; // SQL Server - Buen nivel
  }
  if (normalizedName.includes('mysql')) {
    return 63; // MySQL - Nivel medio-alto
  }

  // Frontend - Nivel intermedio
  if (normalizedName.includes('html')) {
    return 65; // HTML - Conocimiento promedio
  }
  if (normalizedName.includes('css')) {
    return 60; // CSS - Conocimiento promedio
  }
  if (normalizedName.includes('javascript') || normalizedName.includes('js')) {
    return 60; // JavaScript - Conocimiento promedio
  }
  if (normalizedName.includes('react')) {
    return 58; // React - Aprendiendo pero con base
  }
  if (normalizedName.includes('tailwind')) {
    return 55; // Tailwind - Nivel básico-intermedio
  }

  // Herramientas
  if (normalizedName.includes('git') || normalizedName.includes('github')) {
    return 60; // Git/GitHub - Conocimientos básicos de flujo de trabajo
  }
  if (normalizedName.includes('visual studio code') || normalizedName.includes('vscode')) {
    return 65; // VS Code - Editor principal
  }
  if (normalizedName.includes('visual studio') && !normalizedName.includes('code')) {
    return 62; // Visual Studio - Familiaridad con el IDE
  }
  if (normalizedName.includes('figma')) {
    return 45; // Figma - Conocimiento básico
  }
  
  // Otros frameworks y tecnologías - nivel básico-intermedio
  return 50 + (techId % 15); // Entre 50-65% dependiendo de la tecnología
};

const TechSkills = ({ isLoading: parentIsLoading }: TechSkillsProps) => {
  const { darkMode } = useTheme();
  const { skills, loading: skillsLoading } = useSkills();
  
  const isLoading = parentIsLoading !== undefined ? parentIsLoading : skillsLoading;

  // Colores de gradiente para las tarjetas (diferentes según el ID)
  const gradients = [
    ['from-blue-600 to-indigo-700', '#3B82F6', '#4F46E5'],  // Azul a índigo
    ['from-purple-600 to-pink-700', '#9333EA', '#DB2777'],  // Morado a rosa
    ['from-emerald-600 to-teal-700', '#059669', '#0F766E'], // Esmeralda a teal
    ['from-amber-600 to-orange-700', '#D97706', '#C2410C'], // Ámbar a naranja
    ['from-rose-600 to-red-700', '#E11D48', '#B91C1C'],     // Rosa a rojo
    ['from-cyan-600 to-blue-700', '#0891B2', '#1D4ED8']     // Cian a azul
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6">Habilidades Técnicas</h2>
      {isLoading ? (
        <p>Cargando habilidades técnicas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills?.map((skill, index) => {
            const [, startColor, endColor] = gradients[index % gradients.length];
            
            return (
              <div
                key={index}
                className={`relative flex flex-col overflow-hidden rounded-xl
                  ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}
                style={{ 
                  boxShadow: darkMode
                    ? '0 8px 20px rgba(255, 255, 255, 0.05), 0px 2px 10px rgba(30, 30, 255, 0.05)'
                    : '0 8px 20px rgba(0, 0, 0, 0.1), 0px 2px 10px rgba(0, 0, 150, 0.03)'
                }}
              >
                <div className="relative z-10 p-5">
                  <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {skill.category}
                  </h3>
                  <div className="space-y-3">
                    {skill.items.map((item, idx) => {
                      const percentage = getSkillPercentage(item.id_tech || idx, item.name);
                      
                      return (
                        <motion.a 
                          key={idx}
                          href={item.url || getTechDocUrl(item.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative flex items-center w-full py-2 px-3 rounded-md group"
                          title={`Ver documentación de ${item.name}`}
                          whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.2 },
                            boxShadow: darkMode 
                              ? '0 4px 12px rgba(255, 255, 255, 0.1), 0 2px 6px rgba(100, 100, 255, 0.15)'
                              : '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 150, 0.1)'
                          }}
                        >
                          {/* Barra de progreso */}
                          <ProgressFill 
                            $percentage={percentage} 
                            $startColor={startColor}
                            $endColor={endColor}
                            className="absolute left-0 top-0 bottom-0 z-0 rounded-md"
                          />
                          
                          {/* Contenido */}
                          <span className="text-base mr-2 relative z-10">
                            {getTechIcon(item.name, darkMode, 18)}
                          </span>
                          <span className={`text-sm font-medium relative z-10 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {item.name}
                          </span>
                          <span className={`ml-auto text-xs font-medium relative z-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {percentage}%
                          </span>
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

// Componente estilizado para el efecto de llenado
const ProgressFill = styled.div<{ $percentage: number; $startColor: string; $endColor: string }>`
  width: ${props => props.$percentage}%;
  background: linear-gradient(to right, ${props => props.$startColor}, ${props => props.$endColor});
  opacity: 0.3;
  transition: width 1s ease-in-out, opacity 0.3s ease;
  
  .group:hover & {
    opacity: 0.5;
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.2);
  }
`;

export default TechSkills;
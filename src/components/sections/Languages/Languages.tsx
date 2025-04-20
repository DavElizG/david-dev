import { useTheme } from '../../../context';
import { useLanguages } from '../../../hooks';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface LanguagesProps {
  isLoading?: boolean;
}

// Función para convertir nivel de idioma a porcentaje
const getLevelPercentage = (level: string, name: string): number => {
  // Caso especial para inglés: 60%
  if (name.toLowerCase().includes('inglés') || name.toLowerCase().includes('ingles') || 
      name.toLowerCase().includes('english')) {
    return 60;
  }

  // Mapeo de niveles para otros idiomas
  const levels: Record<string, number> = {
    'Básico': 25,
    'Básico A1': 15,
    'A1': 15,
    'Básico A2': 25,
    'A2': 25,
    'Intermedio': 50,
    'Intermedio B1': 50,
    'B1': 50,
    'Intermedio B2': 65,
    'B2': 65,
    'Avanzado': 85,
    'Avanzado C1': 85,
    'C1': 85,
    'Avanzado C2': 95,
    'C2': 95,
    'Nativo': 100,
    'Fluido': 90
  };

  return levels[level] || 50; // 50% por defecto si no se reconoce el nivel
};

const Languages = ({ isLoading: parentIsLoading }: LanguagesProps) => {
  const { darkMode } = useTheme();
  const { languages, loading: languagesLoading } = useLanguages();
  
  const isLoading = parentIsLoading !== undefined ? parentIsLoading : languagesLoading;

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
      <h2 className="text-3xl font-bold mb-6">Idiomas</h2>
      {isLoading ? (
        <p>Cargando idiomas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages?.map((lang, index) => {
            const percentage = getLevelPercentage(lang.level, lang.name);
            const [, startColor, endColor] = gradients[index % gradients.length];
            
            return (
              <motion.div
                key={index}
                className={`relative flex flex-col overflow-hidden rounded-xl transition-all duration-300
                  ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}
                whileHover={{
                  scale: 1.02,
                  boxShadow: darkMode 
                    ? '0px 20px 40px rgba(255, 255, 255, 0.1), 0px 5px 20px rgba(120, 120, 255, 0.1)'
                    : '0px 20px 40px rgba(0, 0, 0, 0.15), 0px 5px 20px rgba(0, 0, 150, 0.07)',
                  transition: { duration: 0.2 }
                }}
                style={{ 
                  boxShadow: darkMode
                    ? '0 8px 20px rgba(255, 255, 255, 0.05), 0px 2px 10px rgba(30, 30, 255, 0.05)'
                    : '0 8px 20px rgba(0, 0, 0, 0.1), 0px 2px 10px rgba(0, 0, 150, 0.03)'
                }}
              >
                {/* Efecto de llenado */}
                <ProgressFill 
                  $percentage={percentage} 
                  $startColor={startColor}
                  $endColor={endColor}
                  className="absolute bottom-0 left-0 z-0"
                />
                
                {/* Contenido del idioma */}
                <div className="relative z-10 p-6 flex flex-col">
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {lang.name}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Nivel: {lang.level}
                    </p>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {percentage}%
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

// Componente estilizado para el efecto de llenado
const ProgressFill = styled.div<{ $percentage: number; $startColor: string; $endColor: string }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: linear-gradient(to right, ${props => props.$startColor}, ${props => props.$endColor});
  opacity: 0.5; /* Aumentado a 0.5 para mayor visibilidad */
  transition: width 1s ease-in-out;
  
  /* Efecto de sombreado para hacer más visible el borde del progreso */
  box-shadow: inset -10px 0 15px -5px rgba(0, 0, 0, 0.1);
`;

export default Languages;
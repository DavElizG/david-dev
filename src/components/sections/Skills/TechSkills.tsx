import { useTechSkills } from '../../../hooks';
import { useTheme } from '../../../context';
import { DraggableTechCard } from '../../common/TechCard';
import { motion } from 'framer-motion';

const TechSkills = () => {
  const { techSkills, loading: techSkillsLoading } = useTechSkills();
  const { darkMode } = useTheme();
  
  // Combinar todas las tecnologías en un solo array con verificación null/undefined
  const allTechItems = techSkills?.flatMap(category => category?.items || []) || [];

  return (
    <section id="tech-skills" className={`py-16 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Tecnologías
          </h2>
        </motion.div>

        {techSkillsLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Grid directo de tecnologías (sin fondos animados) */}
            {allTechItems.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3 py-8 relative z-10">
                {allTechItems.map((tech) => (
                  <DraggableTechCard
                    key={tech?.id_tech || `tech-${Math.random()}`}
                    id={tech?.id_tech || 0}
                    name={tech?.name || 'Sin nombre'}
                    icon={tech?.icon || ''}
                    url={tech?.url || ''}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p>No hay tecnologías disponibles</p>
              </div>
            )}
            
            {/* Mensaje instructivo */}
            <motion.div 
              className="text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Haz clic en cualquier tecnología para visitar su documentación oficial
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TechSkills;
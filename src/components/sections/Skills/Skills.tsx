import { useSkills } from '../../../hooks';
import { useTheme } from '../../../context';
import { DraggableTechCard } from '../../common/TechCard';
import { motion } from 'framer-motion';

const Skills = () => {
  const { skills, loading: skillsLoading } = useSkills();
  const { darkMode } = useTheme();
  
  // Combinar todas las tecnologías en un solo array con verificación null/undefined
  const allTechItems = skills?.flatMap(category => category?.items || []) || [];

  return (
    <section id="skills" className="py-16 relative">
      {/* Separador visual superior */}
      <div className={`absolute top-0 left-0 w-full h-px ${darkMode ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Tecnologías
          </h2>
        </motion.div>

        {skillsLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Grid directo de tecnologías */}
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
          </div>
        )}
      </div>
      
      {/* Separador visual inferior */}
      <div className={`absolute bottom-0 left-0 w-full h-px ${darkMode ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
    </section>
  );
};

export default Skills;
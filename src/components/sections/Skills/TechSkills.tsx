import { useSkills } from '../../../hooks';
import { useTheme } from '../../../context';
import { DraggableTechCard } from '../../common/TechCard';
import { motion } from 'framer-motion';

const Skills = () => {
  const { skills, loading: techSkillsLoading } = useSkills();
  const { darkMode } = useTheme();
  
  // Combinar todas las tecnologías en un solo array
  const allTechItems = skills?.flatMap(category => category.items) || [];

  return (
    <section id="skills" className={`py-16 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
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
            <div className="flex flex-wrap justify-center gap-3 py-8 relative z-10">
              {allTechItems.map((tech) => (
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

export default Skills;
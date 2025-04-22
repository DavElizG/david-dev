import { useProjects } from '../../../hooks';
import { useTheme } from '../../../context';
import ProjectCard from '../../../components/common/ProjectCard';
import { motion } from 'framer-motion';

interface ProjectsProps {
  featured?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ featured = false }) => {
  const { projects, loading, error } = useProjects();
  const { darkMode } = useTheme();

  // Filtrar proyectos destacados si es necesario
  const displayedProjects = featured 
    ? projects?.filter(project => project.featured).slice(0, 3) 
    : projects;

  // Animaciones de entrada para los proyectos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="projects" className="py-16 relative">
      {/* Separador visual superior */}
      <div className={`absolute top-0 left-0 w-full h-px ${darkMode ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            {featured ? 'Proyectos Destacados' : 'Mis Proyectos'}
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayedProjects?.map((project) => (
                <motion.div 
                  key={project.id_project}
                  variants={itemVariants}
                >
                  <ProjectCard
                    id={project.id_project}
                    title={project.title}
                    description={project.description}
                    technologies={project.technologies}
                    repoUrl={project.repoUrl}
                    liveUrl={project.liveUrl}
                    darkMode={darkMode}
                    image={project.image}
                    backendRepo={project.backendRepo}
                    isPrivate={project.isPrivate}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
      
      {/* Separador visual inferior */}
      <div className={`absolute bottom-0 left-0 w-full h-px ${darkMode ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
    </section>
  );
};

export default Projects;
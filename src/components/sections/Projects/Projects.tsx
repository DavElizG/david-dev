import { useProjects } from '../../../hooks';
import ProjectCard from '../../../components/common/ProjectCard';
import { motion } from 'framer-motion';

interface ProjectsProps {
  featured?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ featured = false }) => {
  const { projects, loading, error } = useProjects();

  const displayedProjects = featured
    ? projects?.filter(project => project.featured).slice(0, 3)
    : projects;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="projects" className="py-20 relative">
      <div className="space-divider absolute top-0 left-0 w-full" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-3"
            style={{ color: 'var(--space-text)' }}
          >
            {featured ? 'Featured Projects' : 'Projects'}
          </h2>
          <p className="text-center text-sm mb-12" style={{ color: 'var(--space-text-dim)' }}>
            Selected work
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
              style={{ borderColor: 'var(--space-accent)' }}
            />
          </div>
        ) : error ? (
          <p className="text-center" style={{ color: 'var(--space-accent-2)' }}>Error: {error}</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {displayedProjects?.map((project) => (
              <motion.div key={project.id_project} variants={itemVariants}>
                <ProjectCard
                  id={project.id_project}
                  title={project.title}
                  description={project.description}
                  technologies={project.technologies}
                  repoUrl={project.repoUrl}
                  liveUrl={project.liveUrl}
                  darkMode={true}
                  image={project.image}
                  backendRepo={project.backendRepo}
                  isPrivate={project.isPrivate}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="space-divider absolute bottom-0 left-0 w-full" />
    </section>
  );
};

export default Projects;
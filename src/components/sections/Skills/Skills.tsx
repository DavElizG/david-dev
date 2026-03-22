import { useSkills } from '../../../hooks';
import { DraggableTechCard } from '../../common/TechCard';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Skills = () => {
  const { skills, loading: skillsLoading } = useSkills();
  const [mounted, setMounted] = useState(false);

  const allTechItems = skills?.flatMap(category => category?.items || []) || [];

  useEffect(() => { setMounted(true); }, []);

  return (
    <section id="skills" className="py-20 relative">
      {/* Top divider */}
      <div className="space-divider absolute top-0 left-0 w-full" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-3"
            style={{ color: 'var(--space-text)' }}
          >
            Tech Stack
          </h2>
          <p className="text-center text-sm mb-12" style={{ color: 'var(--space-text-dim)' }}>
            Drag the cards to explore
          </p>
        </motion.div>

        <div className="min-h-[400px]">
          {skillsLoading || !mounted ? (
            <div className="flex justify-center items-center h-[400px]">
              <div
                className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2"
                style={{ borderColor: 'var(--space-accent)' }}
              />
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 py-8">
              {allTechItems.length > 0 ? (
                allTechItems.map((tech) => (
                  <DraggableTechCard
                    key={tech?.id_tech || `tech-${Math.random()}`}
                    id={tech?.id_tech || 0}
                    name={tech?.name || 'Sin nombre'}
                    icon={tech?.icon || ''}
                    url={tech?.url || ''}
                    darkMode={true}
                  />
                ))
              ) : (
                <p style={{ color: 'var(--space-text-dim)' }}>No technologies available</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="space-divider absolute bottom-0 left-0 w-full" />
    </section>
  );
};

export default Skills;
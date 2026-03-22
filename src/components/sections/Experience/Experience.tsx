import { useExperience } from '../../../hooks';
import StyledExperienceCard from './StyledExperienceCard';
import { useRef } from 'react';

interface ExperienceProps {
  isLoading?: boolean;
}

const Experience = ({ isLoading: parentIsLoading }: ExperienceProps) => {
  const { experience, loading: experienceLoading } = useExperience();
  const containerRef = useRef(null);

  const isLoading = parentIsLoading !== undefined ? parentIsLoading : experienceLoading;

  return (
    <section className="mb-16" ref={containerRef}>
      <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--space-text)' }}>
        Experience
      </h2>
      {isLoading ? (
        <p style={{ color: 'var(--space-text-dim)' }}>Loading...</p>
      ) : (
        <div className="space-y-8">
          {experience?.map((exp, index) => (
            <StyledExperienceCard
              key={exp.id_experience || index}
              experience={exp}
              darkMode={true}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Experience;
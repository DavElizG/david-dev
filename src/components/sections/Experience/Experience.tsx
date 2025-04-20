import { useTheme } from '../../../context';
import { useExperience } from '../../../hooks';
import StyledExperienceCard from './StyledExperienceCard';
import { useRef } from 'react';

interface ExperienceProps {
  isLoading?: boolean;
}

const Experience = ({ isLoading: parentIsLoading }: ExperienceProps) => {
  const { darkMode } = useTheme();
  const { experience, loading: experienceLoading } = useExperience();
  const containerRef = useRef(null);
  
  const isLoading = parentIsLoading !== undefined ? parentIsLoading : experienceLoading;

  return (
    <section className="mb-16" ref={containerRef}>
      <h2 className="text-3xl font-bold mb-6">Experiencia</h2>
      {isLoading ? (
        <p>Cargando experiencia...</p>
      ) : (
        <div className="space-y-8">
          {experience?.map((exp, index) => (
            <StyledExperienceCard
              key={exp.id_experience || index}
              experience={exp}
              darkMode={darkMode}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Experience;
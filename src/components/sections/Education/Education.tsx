import { useTheme } from '../../../context';
import { useEducation } from '../../../hooks';
import StyledEducationCard from './StyledEducationCard';
import { useRef } from 'react';

interface EducationProps {
  isLoading?: boolean;
}

const Education = ({ isLoading: parentIsLoading }: EducationProps) => {
  const { darkMode } = useTheme();
  const { education, loading: educationLoading } = useEducation();
  const containerRef = useRef(null);
  
  const isLoading = parentIsLoading !== undefined ? parentIsLoading : educationLoading;

  return (
    <section className="mb-16" ref={containerRef}>
      <h2 className="text-3xl font-bold mb-6">Educación</h2>
      {isLoading ? (
        <p>Cargando educación...</p>
      ) : (
        <div className="space-y-8">
          {education?.map((edu, index) => (
            <StyledEducationCard 
              key={edu.id_education || index}
              education={edu}
              darkMode={darkMode}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Education;
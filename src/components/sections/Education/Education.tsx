import { useEducation } from '../../../hooks';
import StyledEducationCard from './StyledEducationCard';
import { useRef } from 'react';

interface EducationProps {
  isLoading?: boolean;
}

const Education = ({ isLoading: parentIsLoading }: EducationProps) => {
  const { education, loading: educationLoading } = useEducation();
  const containerRef = useRef(null);

  const isLoading = parentIsLoading !== undefined ? parentIsLoading : educationLoading;

  return (
    <section className="mb-16" ref={containerRef}>
      <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--space-text)' }}>
        Education
      </h2>
      {isLoading ? (
        <p style={{ color: 'var(--space-text-dim)' }}>Loading...</p>
      ) : (
        <div className="space-y-8">
          {education?.map((edu, index) => (
            <StyledEducationCard
              key={edu.id_education || index}
              education={edu}
              darkMode={true}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Education;
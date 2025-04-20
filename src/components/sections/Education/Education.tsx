import { useTheme } from '../../../context';
import { useEducation } from '../../../hooks';

interface EducationProps {
  isLoading?: boolean;
}

const Education = ({ isLoading: parentIsLoading }: EducationProps) => {
  const { darkMode } = useTheme();
  const { education, loading: educationLoading } = useEducation();
  
  const isLoading = parentIsLoading !== undefined ? parentIsLoading : educationLoading;

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6">Educación</h2>
      {isLoading ? (
        <p>Cargando educación...</p>
      ) : (
        <div className="space-y-6">
          {education?.map((edu, index) => (
            <div key={index} className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-xl font-semibold">{edu.degree}</h3>
              <p className="text-lg mb-2">{edu.institution}</p>
              <p className="text-sm mb-2">{edu.location}</p>
              <p className="mb-2 opacity-80">{`${edu.startDate} - ${edu.endDate}`}</p>
              <p>{edu.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Education;
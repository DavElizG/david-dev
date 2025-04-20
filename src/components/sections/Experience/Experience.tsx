import { useTheme } from '../../../context';
import { useExperience } from '../../../hooks';

interface ExperienceProps {
  isLoading?: boolean;
}

const Experience = ({ isLoading: parentIsLoading }: ExperienceProps) => {
  const { darkMode } = useTheme();
  const { experience, loading: experienceLoading } = useExperience();
  
  const isLoading = parentIsLoading !== undefined ? parentIsLoading : experienceLoading;

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6">Experiencia</h2>
      {isLoading ? (
        <p>Cargando experiencia...</p>
      ) : (
        <div className="space-y-6">
          {experience?.map((exp, index) => (
            <div key={index} className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                <h3 className="text-xl font-semibold">{exp.role}</h3>
                <span className="text-sm opacity-80">{`${exp.startDate} - ${exp.endDate}`}</span>
              </div>
              <p className="text-lg mb-2">{exp.company}</p>
              <p className="text-sm mb-2">{exp.location}</p>
              <p>{exp.description}</p>
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Tecnologías:</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, idx) => (
                      <span 
                        key={idx} 
                        className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Experience;
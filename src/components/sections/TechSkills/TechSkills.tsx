import { useTheme } from '../../../context';
import { useSkills } from '../../../hooks';
import { getTechIcon, getTechDocUrl } from '../../../utils/iconUtils';

interface TechSkillsProps {
  isLoading?: boolean;
}

const TechSkills = ({ isLoading: parentIsLoading }: TechSkillsProps) => {
  const { darkMode } = useTheme();
  const { skills, loading: skillsLoading } = useSkills();
  
  const isLoading = parentIsLoading !== undefined ? parentIsLoading : skillsLoading;

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6">Habilidades Técnicas</h2>
      {isLoading ? (
        <p>Cargando habilidades técnicas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills?.map((skill, index) => (
            <div key={index} className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} hover:shadow-lg transition-shadow duration-300`}>
              <h3 className="text-xl font-semibold mb-3">{skill.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url || getTechDocUrl(item.name)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-300`}
                    title={`Ver documentación de ${item.name}`}
                  >
                    <span className="text-base">
                      {getTechIcon(item.name, darkMode, 16)}
                    </span>
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TechSkills;
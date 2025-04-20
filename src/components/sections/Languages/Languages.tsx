import { useTheme } from '../../../context';
import { useLanguages } from '../../../hooks';

interface LanguagesProps {
  isLoading?: boolean;
}

const Languages = ({ isLoading: parentIsLoading }: LanguagesProps) => {
  const { darkMode } = useTheme();
  const { languages, loading: languagesLoading } = useLanguages();
  
  const isLoading = parentIsLoading !== undefined ? parentIsLoading : languagesLoading;

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6">Idiomas</h2>
      {isLoading ? (
        <p>Cargando idiomas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages?.map((lang, index) => (
            <div key={index} className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-xl font-semibold mb-2">{lang.name}</h3>
              <p>Nivel: {lang.level}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Languages;
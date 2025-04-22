import { useEducation, useExperience, useSkills, usePersonalInfo } from '../../hooks';
import { useTheme } from '../../context';
import { SEO } from '../../components/common';

const ResumePage = () => {
  const { darkMode } = useTheme();
  const { personalInfo, loading: personalLoading } = usePersonalInfo();
  const { skills, loading: skillsLoading } = useSkills();
  const { education, loading: educationLoading } = useEducation();
  const { experience, loading: experienceLoading } = useExperience();

  const isLoading = personalLoading || skillsLoading || educationLoading || experienceLoading;

  // Función para descargar el CV si lo tienes disponible
  const handleDownloadCV = () => {
    // Aquí puedes añadir la lógica para descargar tu CV en PDF
    // Por ejemplo: window.open('/ruta-a-tu-cv.pdf', '_blank');
    alert('Función para descargar CV - Implementar con tu archivo PDF real');
  };

  return (
    <>
      <SEO 
        title="Currículum | Jose Guadamuz - Desarrollador Web"
        description="Currículum profesional de Jose Guadamuz. Conoce mi experiencia, educación y conjunto completo de habilidades técnicas como desarrollador web full stack."
        keywords="CV, curriculum vitae, experiencia profesional, habilidades técnicas, Jose Guadamuz, desarrollador web, react, typescript"
        ogTitle="Currículum de Jose Guadamuz | Desarrollador Web Full Stack"
        ogDescription="Revisa mi currículum profesional con detalle de mi experiencia, educación y habilidades técnicas como desarrollador web."
      />
      
      <div className={`min-h-screen py-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-center">Curriculum Vitae</h1>
            <button
              onClick={handleDownloadCV}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Descargar CV
            </button>
          </div>

          {isLoading ? (
            <p className="text-center">Cargando información...</p>
          ) : (
            <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Información Personal */}
              <section className="mb-10">
                <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-gray-300">Información Personal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Nombre:</p>
                    <p className="mb-2">{personalInfo?.name}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Título:</p>
                    <p className="mb-2">{personalInfo?.title}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Email:</p>
                    <p className="mb-2">{personalInfo?.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Ubicación:</p>
                    <p className="mb-2">{personalInfo?.location}</p>
                  </div>
                </div>
              </section>

              {/* Experiencia Profesional */}
              <section className="mb-10">
                <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-gray-300">Experiencia Profesional</h2>
                {experience?.map((exp, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <h3 className="text-xl font-semibold">{exp.role}</h3>
                      <span className="text-sm opacity-80">{`${exp.startDate} - ${exp.endDate}`}</span>
                    </div>
                    <p className="text-lg mb-2">{exp.company}</p>
                    <p className="text-sm mb-2">{exp.location}</p>
                    <p>{exp.description}</p>
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="mt-2">
                        <p className="font-semibold">Tecnologías:</p>
                        <p>{exp.technologies.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </section>

              {/* Educación */}
              <section className="mb-10">
                <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-gray-300">Educación</h2>
                {education?.map((edu, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-xl font-semibold">{edu.degree}</h3>
                    <p className="text-lg mb-2">{edu.institution}</p>
                    <p className="text-sm mb-2">{edu.location}</p>
                    <p className="mb-2 opacity-80">{`${edu.startDate} - ${edu.endDate}`}</p>
                    <p>{edu.description}</p>
                  </div>
                ))}
              </section>

              {/* Habilidades */}
              <section className="mb-10">
                <h2 className="text-3xl font-bold mb-6 pb-2 border-b border-gray-300">Habilidades</h2>
                <div className="space-y-4">
                  {skills?.map((skillCategory, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="text-xl font-semibold mb-2">{skillCategory.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {skillCategory.items.map((item, idx) => (
                          <span 
                            key={idx} 
                            className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                          >
                            {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResumePage;
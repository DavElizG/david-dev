import { usePersonalInfo } from "../../../hooks";
import { useTheme } from "../../../context";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const { personalInfo, loading } = usePersonalInfo();
  const { darkMode } = useTheme();

  // Función helper para obtener el enlace social específico
  const getSocialLink = (platform: string) => {
    return personalInfo?.socialLinks.find(link => 
      link.platform.toLowerCase() === platform.toLowerCase()
    );
  };

  const githubLink = getSocialLink('github');
  const linkedinLink = getSocialLink('linkedin');

  return (
    <footer className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'} py-8`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo/Nombre */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">
              {loading ? "Cargando..." : personalInfo?.name}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {personalInfo?.title}
            </p>
          </div>

          {/* Redes sociales */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            {githubLink && (
              <a
                href={githubLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xl hover:scale-110 transition-transform ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            )}
            {linkedinLink && (
              <a
                href={linkedinLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xl hover:scale-110 transition-transform ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            )}
            {personalInfo?.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className={`text-xl hover:scale-110 transition-transform ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
            )}
          </div>

          {/* Copyright */}
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © {new Date().getFullYear()} {personalInfo?.name}. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
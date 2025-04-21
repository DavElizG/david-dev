import { usePersonalInfo } from "../../../hooks";
import { useTheme } from "../../../context";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useState, useEffect } from "react";

const Footer = () => {
  const { personalInfo, loading } = usePersonalInfo();
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();
  
  // Establecer el estado de montado después del renderizado inicial
  useEffect(() => {
    setMounted(true);
  }, []);

  // Función helper para obtener el enlace social específico
  const getSocialLink = (platform: string) => {
    return personalInfo?.socialLinks.find(link => 
      link.platform.toLowerCase() === platform.toLowerCase()
    );
  };

  const githubLink = getSocialLink('github');
  const linkedinLink = getSocialLink('linkedin');

  // Contenido placeholder para mantener el layout estable durante la carga
  const placeholderName = "David Guadamuz";
  const placeholderTitle = "Desarrollador Full Stack";
  
  return (
    <footer className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'} py-8`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Logo/Nombre - Ancho fijo en contenedor */}
          <div className="text-center md:text-left min-h-[60px] flex flex-col justify-center">
            <h3 className="text-lg font-bold">
              {(!mounted || loading) ? placeholderName : personalInfo?.name}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {(!mounted || loading) ? placeholderTitle : personalInfo?.title}
            </p>
          </div>

          {/* Redes sociales - Centrado con altura fija */}
          <div className="flex justify-center space-x-4 min-h-[24px]">
            <a
              href={githubLink?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xl hover:scale-110 transition-transform ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href={linkedinLink?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xl hover:scale-110 transition-transform ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href={`mailto:${personalInfo?.email || "correo@ejemplo.com"}`}
              className={`text-xl hover:scale-110 transition-transform ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>

          {/* Copyright - Derecha con altura fija */}
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center md:text-right min-h-[24px]`}>
            © {currentYear} {(!mounted || loading) ? placeholderName : personalInfo?.name}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
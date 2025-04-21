import React from 'react';
import { FaDatabase, FaLaptopCode } from 'react-icons/fa';
import { DiDotnet } from 'react-icons/di';
import { VscCode } from 'react-icons/vsc';

// Import only the most commonly used icons individually
import { 
  SiReact, SiTypescript, SiJavascript, SiHtml5, SiCss3, 
  SiTailwindcss, SiMysql, SiGit, SiGithub, SiFigma 
} from 'react-icons/si';

// Map of commonly used icons - only import what you actually use
const commonIcons: Record<string, React.ComponentType<any>> = {
  react: SiReact,
  typescript: SiTypescript,
  javascript: SiJavascript,
  html5: SiHtml5,
  css3: SiCss3,
  tailwindcss: SiTailwindcss,
  mysql: SiMysql,
  git: SiGit,
  github: SiGithub,
  figma: SiFigma,
};

// Iconos específicos para casos especiales
const specificIcons: Record<string, React.FC<{ size?: number; color?: string }>> = {
  'vscode': (props) => <VscCode {...props} />,
  'visualstudiocode': (props) => <VscCode {...props} />,
  'vs code': (props) => <VscCode {...props} />,
  'visual studio code': (props) => <VscCode {...props} />,
  'visualstudio': (props) => <FaLaptopCode {...props} />,
  'visual studio': (props) => <FaLaptopCode {...props} />,
};

// Mapa de colores originales para los iconos
export const iconColors: Record<string, string> = {
  html5: '#E34F26',
  css3: '#1572B6',
  javascript: '#F7DF1E',
  react: '#61DAFB',
  typescript: '#3178C6',
  tailwindcss: '#06B6D4',
  dotnet: '#512BD4',
  microsoftsqlserver: '#CC2927',
  sqlserver: '#CC2927',
  mysql: '#4479A1',
  git: '#F05032',
  github: '#181717',
  visualstudiocode: '#007ACC',
  vscode: '#007ACC',
  visualstudio: '#5C2D91',
  figma: '#F24E1E',
};

// Mapa de nombres alternativos para iconos que podrían no encontrarse con su nombre original
export const iconAlternatives: Record<string, string> = {
  'visualstudiocode': 'vscode',
  'microsoftsqlserver': 'mssql',
  'sqlserver': 'mssql',
  'sql server': 'mssql',
  'dotnet': 'dot-net',
  'tailwind': 'tailwindcss',
  '.netc#': 'dotnet',
  '.net': 'dotnet',
  '.net c#': 'dotnet',
  'vs code': 'vscode',
  'visual studio code': 'vscode',
  'visual studio': 'visualstudio',
};

/**
 * Normaliza el nombre de una tecnología para buscar su icono correspondiente
 */
export const normalizeTechName = (techName: string): string => {
  const normalized = techName.toLowerCase().replace(/\s+/g, '');
  return iconAlternatives[normalized] || normalized;
};

/**
 * Genera un componente de icono a partir del nombre de una tecnología
 */
export const getTechIcon = (techName: string, darkMode: boolean, size: number = 36) => {
  const normalizedTechName = techName.toLowerCase();

  // Casos especiales para ciertos iconos
  if (
    normalizedTechName.includes('sql server') ||
    normalizedTechName === 'microsoftsqlserver' ||
    normalizedTechName === 'sqlserver'
  ) {
    return <FaDatabase size={size} color="#CC2927" />;
  }

  if (
    normalizedTechName === 'dotnet' ||
    normalizedTechName === '.net' ||
    normalizedTechName.includes('.net c#')
  ) {
    return <DiDotnet size={size} color="#512BD4" />;
  }

  // Normalizar el nombre para la búsqueda
  const iconKey = normalizeTechName(techName);

  // Verificar si es uno de nuestros iconos específicos
  if (specificIcons[iconKey]) {
    const color = iconColors[iconKey] || (darkMode ? '#60A5FA' : '#2563EB');
    return specificIcons[iconKey]({ size, color });
  }

  // Check if we have the icon in our common icons map
  if (commonIcons[iconKey]) {
    const IconComponent = commonIcons[iconKey];
    const color = iconColors[iconKey] || (darkMode ? '#60A5FA' : '#2563EB');
    return <IconComponent size={size} color={color} />;
  }

  // Fallback for icons not pre-imported
  const sizeClass = `w-[${Math.round(size / 1.5)}px] h-[${Math.round(size / 1.5)}px] text-[${Math.round(size / 2.5)}px]`;
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 ${sizeClass}`}
    >
      {techName.charAt(0).toUpperCase()}
    </div>
  );
};

/**
 * Obtiene la URL de documentación de una tecnología
 */
export const getTechDocUrl = (techName: string): string => {
  const normalizedName = techName.toLowerCase();
  const techDocsUrls: Record<string, string> = {
    react: 'https://es.react.dev/',
    'tailwind css': 'https://tailwindcss.com/docs',
    javascript: 'https://developer.mozilla.org/es/docs/Web/JavaScript',
    html5: 'https://developer.mozilla.org/es/docs/Web/HTML',
    css3: 'https://developer.mozilla.org/es/docs/Web/CSS',
    typescript: 'https://www.typescriptlang.org/docs/',
    '.net c#': 'https://learn.microsoft.com/es-es/dotnet/csharp/',
    'sql server': 'https://learn.microsoft.com/es-es/sql/sql-server/',
    mysql: 'https://dev.mysql.com/doc/',
  };

  for (const [key, url] of Object.entries(techDocsUrls)) {
    if (normalizedName.includes(key.toLowerCase())) {
      return url;
    }
  }

  return `https://www.google.com/search?q=${encodeURIComponent(techName)}+documentation`;
};

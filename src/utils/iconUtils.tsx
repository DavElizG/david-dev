import * as SiIcons from 'react-icons/si';
import { FaDatabase } from 'react-icons/fa';
import { DiDotnet } from 'react-icons/di';
import { VscCode } from 'react-icons/vsc'; // Visual Studio Code icon from vscode-icons
import { BsFiletypeJson } from 'react-icons/bs'; // Alternativa para Visual Studio

// Tipo para el objeto de iconos dinámicos
type IconsType = {
  [key: string]: React.ElementType;
};

// Todas las propiedades de SiIcons convertidas a un objeto con tipos
const Icons = SiIcons as unknown as IconsType;

// Iconos específicos para casos especiales
const specificIcons: Record<string, React.FC<{size?: number; color?: string}>> = {
  'vscode': (props) => <VscCode {...props} />,
  'visualstudiocode': (props) => <VscCode {...props} />,
  'visualstudio': (props) => <BsFiletypeJson {...props} /> // Usamos una alternativa temporal
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
  sqlserver: '#CC2927', // Añadido explícitamente para SQL Server
  mysql: '#4479A1',
  git: '#F05032',
  github: '#181717',
  visualstudiocode: '#007ACC',
  vscode: '#007ACC',
  visualstudio: '#5C2D91',
  figma: '#F24E1E'
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
  'visual studio': 'visualstudio'
};

// Mapa de tecnologías con sus urls de documentación
export const techDocsUrls: Record<string, string> = {
  'react': 'https://es.react.dev/',
  'tailwind css': 'https://tailwindcss.com/docs',
  'javascript': 'https://developer.mozilla.org/es/docs/Web/JavaScript',
  'html5': 'https://developer.mozilla.org/es/docs/Web/HTML',
  'css3': 'https://developer.mozilla.org/es/docs/Web/CSS',
  'typescript': 'https://www.typescriptlang.org/docs/',
  '.net c#': 'https://learn.microsoft.com/es-es/dotnet/csharp/',
  'sql server': 'https://learn.microsoft.com/es-es/sql/sql-server/',
  'mysql': 'https://dev.mysql.com/doc/'
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
  // Casos especiales para ciertos iconos
  if (techName.toLowerCase().includes('sql server') ||
      techName.toLowerCase() === 'microsoftsqlserver' ||
      techName.toLowerCase() === 'sqlserver') {
    // Usar un icono específico para SQL Server con el color rojo característico
    return <FaDatabase size={size} color="#CC2927" />;
  }

  if (techName.toLowerCase() === 'dotnet' ||
      techName.toLowerCase() === '.net' ||
      techName.toLowerCase().includes('.net c#')) {
    // Usar un icono específico para .NET con el color púrpura característico
    return <DiDotnet size={size} color="#512BD4" />;
  }

  // Normalizar el nombre para la búsqueda
  const iconKey = normalizeTechName(techName);
  
  // Verificar si es uno de nuestros iconos específicos
  if (specificIcons[iconKey]) {
    const color = iconColors[iconKey] || (darkMode ? '#60A5FA' : '#2563EB');
    return specificIcons[iconKey]({ size, color });
  }
  
  // Formar el nombre del componente para la biblioteca de iconos Si
  const formattedName = `Si${iconKey.charAt(0).toUpperCase()}${iconKey.slice(1)}`;
  
  // Verificar si el icono existe en la biblioteca SiIcons
  if (Icons[formattedName]) {
    const IconComponent = Icons[formattedName];
    // Obtener el color original del icono o usar un color por defecto
    const color = iconColors[iconKey] || (darkMode ? '#60A5FA' : '#2563EB');
    return <IconComponent size={size} color={color} />;
  }
  
  // Fallback para iconos no encontrados
  const sizeClass = `w-[${Math.round(size / 1.5)}px] h-[${Math.round(size / 1.5)}px] text-[${Math.round(size / 2.5)}px]`;
  console.log(`No se encontró el icono: ${formattedName} para tech: ${techName}`);
  return (
    <div className={`flex items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 ${sizeClass}`}>
      {techName.charAt(0).toUpperCase()}
    </div>
  );
};

/**
 * Obtiene la URL de documentación de una tecnología
 */
export const getTechDocUrl = (techName: string): string => {
  const normalizedName = techName.toLowerCase();
  for (const [key, url] of Object.entries(techDocsUrls)) {
    if (normalizedName.includes(key.toLowerCase())) {
      return url;
    }
  }
  // URL de fallback si no se encuentra la tecnología
  return `https://www.google.com/search?q=${encodeURIComponent(techName)}+documentation`;
};
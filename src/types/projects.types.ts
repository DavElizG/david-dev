export interface Project {
  id_project: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
}

/**
 * Props para el componente ProjectCard 
 */
export interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  repoUrl: string;
  liveUrl: string;
  darkMode: boolean;
  image?: string;
}
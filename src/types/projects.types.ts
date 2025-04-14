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
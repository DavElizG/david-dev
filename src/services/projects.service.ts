import { fetchData } from './api';
import { Project } from '../types/projects.types';

/**
 * Obtiene todos los proyectos
 */
export async function getAllProjects(): Promise<Project[]> {
  return fetchData<Project[]>('projects');
}

/**
 * Obtiene un proyecto específico por ID
 */
export async function getProjectById(id: number): Promise<Project | undefined> {
  const projects = await getAllProjects();
  return projects.find(project => project.id_project === id);
}

/**
 * Obtiene proyectos destacados
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter(project => project.featured);
}
import { fetchData } from './api';
import type { Language } from '../context';
import { Project } from '../types/projects.types';

export async function getAllProjects(language?: Language): Promise<Project[]> {
  return fetchData<Project[]>('projects', language);
}

export async function getProjectById(id: number, language?: Language): Promise<Project | undefined> {
  const projects = await getAllProjects(language);
  return projects.find(project => project.id_project === id);
}

export async function getFeaturedProjects(language?: Language): Promise<Project[]> {
  const projects = await getAllProjects(language);
  return projects.filter(project => project.featured);
}
import { fetchData } from './api';
import { Experience } from '../types/experience.types';

/**
 * Obtiene toda la información de experiencia laboral
 */
export async function getAllExperience(): Promise<Experience[]> {
  return fetchData<Experience[]>('experience');
}

/**
 * Obtiene una experiencia específica por ID
 */
export async function getExperienceById(id: number): Promise<Experience | undefined> {
  const experience = await getAllExperience();
  return experience.find(item => item.id_experience === id);
}
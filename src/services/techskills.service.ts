import { fetchData } from './api';
import { TechSkillCategory, Technology } from '../types/techskills.types';

/**
 * Obtiene todas las categorías de habilidades técnicas
 */
export async function getTechSkills(): Promise<TechSkillCategory[]> {
  return fetchData<TechSkillCategory[]>('techskills');
}

/**
 * Obtiene una categoría de habilidades técnicas por ID
 */
export async function getTechSkillCategoryById(id: number): Promise<TechSkillCategory | undefined> {
  const techSkills = await getTechSkills();
  return techSkills.find(category => category.id_skill === id);
}

/**
 * Obtiene todas las tecnologías de todas las categorías
 */
export async function getAllTechTechnologies(): Promise<Technology[]> {
  const techSkills = await getTechSkills();
  return techSkills.flatMap(category => category.items);
}
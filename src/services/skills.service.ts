import { fetchData } from './api';
import { SkillCategory, Technology } from '../types/skills.types';

/**
 * Obtiene todas las categorías de habilidades
 */
export async function getAllSkills(): Promise<SkillCategory[]> {
  return fetchData<SkillCategory[]>('skills');
}

/**
 * Obtiene una categoría de habilidades por ID
 */
export async function getSkillCategoryById(id: number): Promise<SkillCategory | undefined> {
  const skills = await getAllSkills();
  return skills.find(category => category.id_skill === id);
}

/**
 * Obtiene todas las tecnologías de todas las categorías
 */
export async function getAllTechnologies(): Promise<Technology[]> {
  const skills = await getAllSkills();
  return skills.flatMap(category => category.items);
}
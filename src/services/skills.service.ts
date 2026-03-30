import { fetchData } from './api';
import type { Language } from '../context';
import { SkillCategory, Technology } from '../types/skills.types';

export async function getAllSkills(language?: Language): Promise<SkillCategory[]> {
  return fetchData<SkillCategory[]>('skills', language);
}

export async function getSkillCategoryById(id: number, language?: Language): Promise<SkillCategory | undefined> {
  const skills = await getAllSkills(language);
  return skills.find(category => category.id_skill === id);
}

export async function getAllTechnologies(language?: Language): Promise<Technology[]> {
  const skills = await getAllSkills(language);
  return skills.flatMap(category => category.items);
}
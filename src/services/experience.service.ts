import { fetchData } from './api';
import type { Language } from '../context';
import { Experience } from '../types/experience.types';

export async function getAllExperience(language?: Language): Promise<Experience[]> {
  return fetchData<Experience[]>('experience', language);
}

export async function getExperienceById(id: number, language?: Language): Promise<Experience | undefined> {
  const experience = await getAllExperience(language);
  return experience.find(item => item.id_experience === id);
}
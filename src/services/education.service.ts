import { fetchData } from './api';
import type { Language } from '../context';
import { Education } from '../types/education.types';

export async function getAllEducation(language?: Language): Promise<Education[]> {
  return fetchData<Education[]>('education', language);
}

export async function getEducationById(id: number, language?: Language): Promise<Education | undefined> {
  const education = await getAllEducation(language);
  return education.find(item => item.id_education === id);
}
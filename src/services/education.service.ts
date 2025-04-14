import { fetchData } from './api';
import { Education } from '../types/education.types';

/**
 * Obtiene toda la información educativa
 */
export async function getAllEducation(): Promise<Education[]> {
  return fetchData<Education[]>('education');
}

/**
 * Obtiene una entrada educativa por ID
 */
export async function getEducationById(id: number): Promise<Education | undefined> {
  const education = await getAllEducation();
  return education.find(item => item.id_education === id);
}
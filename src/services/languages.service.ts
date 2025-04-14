import { fetchData } from './api';
import { Language } from '../types/languages.types';

/**
 * Obtiene todos los idiomas
 */
export async function getAllLanguages(): Promise<Language[]> {
  return fetchData<Language[]>('languages');
}

/**
 * Obtiene un idioma específico por ID
 */
export async function getLanguageById(id: number): Promise<Language | undefined> {
  const languages = await getAllLanguages();
  return languages.find(language => language.id_language === id);
}
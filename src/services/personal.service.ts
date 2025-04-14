import { fetchData } from './api';
import { PersonalInfo } from '../types/personal.types';

/**
 * Obtiene los datos personales del portafolio
 */
export async function getPersonalInfo(): Promise<PersonalInfo> {
  return fetchData<PersonalInfo>('personal');
}
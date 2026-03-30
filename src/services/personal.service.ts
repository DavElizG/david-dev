import { fetchData } from './api';
import type { Language } from '../context';
import { PersonalInfo } from '../types/personal.types';

export async function getPersonalInfo(language?: Language): Promise<PersonalInfo> {
  return fetchData<PersonalInfo>('personal', language);
}
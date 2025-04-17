import { SoftSkills } from '../types/softskills.types';
import { fetchData } from './api';

export const getSoftSkills = async (): Promise<SoftSkills> => {
  try {
    return await fetchData<SoftSkills>('softskills');
  } catch (error) {
    console.error('Error fetching soft skills data:', error);
    return [];
  }
};
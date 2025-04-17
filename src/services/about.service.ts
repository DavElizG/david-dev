import { AboutInfo } from '../types/about.types';
import aboutData from '../data/about.json';

/**
 * Obtiene la información de About
 * @returns Promise con la información de About
 */
export const getAboutInfo = (): Promise<AboutInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(aboutData as AboutInfo);
    }, 300);
  });
};
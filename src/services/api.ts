/**
 * Cliente base para realizar peticiones
 * Actualmente simula peticiones cargando archivos JSON locales
 * En el futuro se puede reemplazar por fetch/axios manteniendo la misma interfaz
 */

import type { Language } from '../context';

// Importaciones estáticas para cada idioma/archivo — Vite las incluye en el bundle
const dataModules = import.meta.glob<{ default: unknown }>('../data/**/*.json', { eager: true });

function resolveData<T>(dataFile: string, language?: Language): T {
  // Try localized path first, then fallback to root
  const localizedKey = `../data/${language}/${dataFile}.json`;
  const rootKey = `../data/${dataFile}.json`;
  const mod = (language && dataModules[localizedKey]) || dataModules[rootKey];
  if (!mod) throw new Error(`Data not found: ${dataFile} (${language ?? 'default'})`);
  return (mod.default ?? mod) as T;
}

export async function fetchData<T>(dataFile: string, language?: Language): Promise<T> {
  return resolveData<T>(dataFile, language);
}
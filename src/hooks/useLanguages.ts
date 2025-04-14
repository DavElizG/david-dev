import { useState, useEffect } from 'react';
import { getAllLanguages, getLanguageById } from '../services';
import { Language } from '../types/languages.types';

export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const data = await getAllLanguages();
        setLanguages(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los idiomas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const getById = async (id: number): Promise<Language | undefined> => {
    try {
      return await getLanguageById(id);
    } catch (err) {
      console.error(`Error al buscar idioma con ID ${id}:`, err);
      return undefined;
    }
  };

  // Filtrar por nivel de competencia
  const getLanguagesByLevel = (level: string): Language[] => {
    return languages.filter(lang => 
      lang.level.toLowerCase().includes(level.toLowerCase())
    );
  };

  return {
    languages,
    loading,
    error,
    getById,
    getLanguagesByLevel
  };
}
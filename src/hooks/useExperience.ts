import { useState, useEffect, useMemo } from 'react';
import { getAllExperience, getExperienceById } from '../services';
import { Experience } from '../types/experience.types';

export function useExperience() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const data = await getAllExperience();
        setExperience(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar la experiencia laboral');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  // Obtener experiencia actual (donde endDate contiene "Presente")
  const currentExperience = useMemo(() => {
    return experience.find(exp => 
      exp.endDate.toLowerCase().includes('presente')
    );
  }, [experience]);

  const getById = async (id: number): Promise<Experience | undefined> => {
    try {
      return await getExperienceById(id);
    } catch (err) {
      console.error(`Error al buscar experiencia con ID ${id}:`, err);
      return undefined;
    }
  };

  return {
    experience,
    currentExperience,
    loading,
    error,
    getById
  };
}
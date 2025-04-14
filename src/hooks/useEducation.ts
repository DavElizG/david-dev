import { useState, useEffect } from 'react';
import { getAllEducation, getEducationById } from '../services';
import { Education } from '../types/education.types';

export function useEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const data = await getAllEducation();
        setEducation(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar la información educativa');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  const getById = async (id: number): Promise<Education | undefined> => {
    try {
      return await getEducationById(id);
    } catch (err) {
      console.error(`Error al buscar educación con ID ${id}:`, err);
      return undefined;
    }
  };

  return {
    education,
    loading,
    error,
    getById
  };
}
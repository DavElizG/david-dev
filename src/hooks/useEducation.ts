import { useState, useEffect } from 'react';
import { getAllEducation, getEducationById } from '../services';
import { useLanguage } from '../context';
import { Education } from '../types/education.types';

export function useEducation() {
  const { language } = useLanguage();
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const data = await getAllEducation(language);
        setEducation(data);
        setError(null);
      } catch (err) {
        setError('Error loading education data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [language]);

  const getById = async (id: number): Promise<Education | undefined> => {
    try {
      return await getEducationById(id, language);
    } catch (err) {
      console.error(`Error fetching education ID ${id}:`, err);
      return undefined;
    }
  };

  return { education, loading, error, getById };
}
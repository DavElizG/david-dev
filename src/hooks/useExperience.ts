import { useState, useEffect, useMemo } from 'react';
import { getAllExperience, getExperienceById } from '../services';
import { useLanguage } from '../context';
import { Experience } from '../types/experience.types';

export function useExperience() {
  const { language } = useLanguage();
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const data = await getAllExperience(language);
        setExperience(data);
        setError(null);
      } catch (err) {
        setError('Error loading experience data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [language]);

  const currentExperience = useMemo(() => {
    return experience.find(exp =>
      exp.endDate.toLowerCase().includes('presente') ||
      exp.endDate.toLowerCase().includes('present')
    );
  }, [experience]);

  const getById = async (id: number): Promise<Experience | undefined> => {
    try {
      return await getExperienceById(id, language);
    } catch (err) {
      console.error(`Error fetching experience ID ${id}:`, err);
      return undefined;
    }
  };

  return { experience, currentExperience, loading, error, getById };
}
import { useState, useEffect } from 'react';
import { getPersonalInfo } from '../services';
import { useLanguage } from '../context';
import { PersonalInfo } from '../types/personal.types';

export function usePersonalInfo() {
  const { language } = useLanguage();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        const data = await getPersonalInfo(language);
        setPersonalInfo(data);
        setError(null);
      } catch (err) {
        setError('Error loading personal info');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, [language]);

  return { personalInfo, loading, error };
}
import { useState, useEffect } from 'react';
import { getPersonalInfo } from '../services';
import { PersonalInfo } from '../types/personal.types';

export function usePersonalInfo() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        const data = await getPersonalInfo();
        setPersonalInfo(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar la información personal');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  return { personalInfo, loading, error };
}
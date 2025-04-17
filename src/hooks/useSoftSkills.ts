import { useState, useEffect } from 'react';
import { SoftSkills } from '../types/softskills.types';
import { getSoftSkills } from '../services/softskills.service';

export const useSoftSkills = () => {
  const [softSkills, setSoftSkills] = useState<SoftSkills>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSoftSkills = async () => {
      try {
        setLoading(true);
        const data = await getSoftSkills();
        setSoftSkills(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las habilidades blandas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSoftSkills();
  }, []);

  return { softSkills, loading, error };
};
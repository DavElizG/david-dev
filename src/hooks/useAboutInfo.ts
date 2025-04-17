import { useState, useEffect } from 'react';
import { AboutInfo } from '../types/about.types';
import { getAboutInfo } from '../services/about.service';

/**
 * Hook para obtener la información de About
 * @returns Información de About y estado de carga
 */
export const useAboutInfo = () => {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        setLoading(true);
        const data = await getAboutInfo();
        setAboutInfo(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar la información de About');
        console.error('Error fetching About info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutInfo();
  }, []);

  return { aboutInfo, loading, error };
};
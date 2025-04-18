import { useState, useEffect } from 'react';
import { getTechSkills, getTechSkillCategoryById, getAllTechTechnologies } from '../services/techskills.service';
import { TechSkillCategory, Technology } from '../types/techskills.types';

export function useTechSkills() {
  const [techSkills, setTechSkills] = useState<TechSkillCategory[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechSkills = async () => {
      try {
        setLoading(true);
        const techSkillsData = await getTechSkills();
        const techData = await getAllTechTechnologies();
        
        setTechSkills(techSkillsData);
        setTechnologies(techData);
        setError(null);
      } catch (err) {
        setError('Error al cargar las habilidades técnicas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechSkills();
  }, []);

  const getCategoryById = async (id: number): Promise<TechSkillCategory | undefined> => {
    try {
      return await getTechSkillCategoryById(id);
    } catch (err) {
      console.error(`Error al buscar categoría con ID ${id}:`, err);
      return undefined;
    }
  };

  // Filtrar tecnologías por categoría
  const getTechnologiesByCategory = (categoryName: string): Technology[] => {
    const category = techSkills.find(cat => 
      cat.category.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.items : [];
  };

  return {
    techSkills,
    technologies,
    loading,
    error,
    getCategoryById,
    getTechnologiesByCategory
  };
}
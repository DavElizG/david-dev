import { useState, useEffect } from 'react';
import { getAllSkills, getSkillCategoryById, getAllTechnologies } from '../services';
import { SkillCategory, Technology } from '../types/skills.types';

export function useSkills() {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const skillsData = await getAllSkills();
        const techData = await getAllTechnologies();
        
        setSkills(skillsData);
        setTechnologies(techData);
        setError(null);
      } catch (err) {
        setError('Error al cargar las habilidades');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const getCategoryById = async (id: number): Promise<SkillCategory | undefined> => {
    try {
      return await getSkillCategoryById(id);
    } catch (err) {
      console.error(`Error al buscar categoría con ID ${id}:`, err);
      return undefined;
    }
  };

  // Filtrar tecnologías por categoría
  const getTechnologiesByCategory = (categoryName: string): Technology[] => {
    const category = skills.find(cat => 
      cat.category.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.items : [];
  };

  return {
    skills,
    technologies,
    loading,
    error,
    getCategoryById,
    getTechnologiesByCategory
  };
}
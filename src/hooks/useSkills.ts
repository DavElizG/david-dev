import { useState, useEffect } from 'react';
import { getAllSkills, getSkillCategoryById, getAllTechnologies } from '../services';
import { useLanguage } from '../context';
import { SkillCategory, Technology } from '../types/skills.types';

export function useSkills() {
  const { language } = useLanguage();
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const skillsData = await getAllSkills(language);
        const techData = await getAllTechnologies(language);
        setSkills(skillsData);
        setTechnologies(techData);
        setError(null);
      } catch (err) {
        setError('Error loading skills');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [language]);

  const getCategoryById = async (id: number): Promise<SkillCategory | undefined> => {
    try {
      return await getSkillCategoryById(id, language);
    } catch (err) {
      console.error(`Error fetching category ID ${id}:`, err);
      return undefined;
    }
  };

  const getTechnologiesByCategory = (categoryName: string): Technology[] => {
    const category = skills.find(cat =>
      cat.category.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.items : [];
  };

  return { skills, technologies, loading, error, getCategoryById, getTechnologiesByCategory };
}
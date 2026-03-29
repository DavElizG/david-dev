import { useState, useEffect, useMemo } from 'react';
import { getAllProjects, getProjectById } from '../services';
import { useLanguage } from '../context';
import { Project } from '../types/projects.types';

export function useProjects() {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getAllProjects(language);
        setProjects(data);
        setError(null);
      } catch (err) {
        setError('Error loading projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [language]);

  const featuredProjects = useMemo(() => {
    return projects.filter(project => project.featured);
  }, [projects]);

  const getById = async (id: number): Promise<Project | undefined> => {
    try {
      return await getProjectById(id, language);
    } catch (err) {
      console.error(`Error fetching project ID ${id}:`, err);
      return undefined;
    }
  };

  const getProjectsByTech = (tech: string): Project[] => {
    return projects.filter(project =>
      project.technologies.some(t =>
        t.toLowerCase().includes(tech.toLowerCase())
      )
    );
  };

  return { projects, featuredProjects, loading, error, getById, getProjectsByTech };
}
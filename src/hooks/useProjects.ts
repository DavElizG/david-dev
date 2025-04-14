import { useState, useEffect, useMemo } from 'react';
import { getAllProjects, getProjectById } from '../services';
import { Project } from '../types/projects.types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getAllProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los proyectos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Proyectos destacados memoizados
  const featuredProjects = useMemo(() => {
    return projects.filter(project => project.featured);
  }, [projects]);

  const getById = async (id: number): Promise<Project | undefined> => {
    try {
      return await getProjectById(id);
    } catch (err) {
      console.error(`Error al buscar proyecto con ID ${id}:`, err);
      return undefined;
    }
  };

  // Filtrar proyectos por tecnología
  const getProjectsByTech = (tech: string): Project[] => {
    return projects.filter(project => 
      project.technologies.some(t => 
        t.toLowerCase().includes(tech.toLowerCase())
      )
    );
  };

  return {
    projects,
    featuredProjects,
    loading,
    error,
    getById,
    getProjectsByTech
  };
}
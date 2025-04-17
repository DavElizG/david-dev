/**
 * Interfaz para un elemento tecnológico individual
 */
export interface TechItem {
  id_tech: number;
  name: string;
  icon: string;
  url: string;
}

/**
 * Props para el componente DraggableTechCard
 */
export interface TechCardProps {
  id: number;
  name: string;
  icon: string;
  url: string;
  darkMode: boolean;
}

/**
 * Props para el componente InteractiveTechGrid
 */
export interface InteractiveTechGridProps {
  techItems: TechItem[];
  darkMode: boolean;
}
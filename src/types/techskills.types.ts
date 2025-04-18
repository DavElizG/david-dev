// src/types/techskills.types.ts
export interface Technology {
  id_tech: number;
  name: string;
  icon: string;
  url: string;
}

export interface TechSkillCategory {
  id_skill: number;
  category: string;
  items: Technology[];
}

export type TechSkills = TechSkillCategory[];
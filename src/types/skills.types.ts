// src/types/skills.types.ts
export interface Technology {
  id_tech: number;
  name: string;
  icon: string;
  url: string;
}

export interface SkillCategory {
  id_skill: number;
  category: string;
  items: Technology[];
}

export type Skills = SkillCategory[];
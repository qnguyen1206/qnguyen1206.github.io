export interface Project {
  title: string;
  description: string;
  image: string;
  tech: string;
  github?: string;
  live?: string;
  status?: string;
  emulator?: boolean;
  types: string[];
}

export type ProgressAction = {
  type: 'VIEW_PROJECT' | 'VIEW_SKILL' | 'VIEW_EXPERIENCE' | 'VIEW_EDUCATION' | 'SUBMIT_CONTACT' | 'VIEW_GALLERY';
  id: string;
};

export interface GameProgress {
  projects: Set<string>;
  skills: Set<string>;
  experiences: Set<string>;
  education: Set<string>;
  gallery: Set<string>;
  totalProjects: number;
  totalSkills: number;
  totalExperiences: number;
  totalEducation: number;
  totalGallery: number;
}

export const COMPLETION_XP = {
  PROJECT: 10,
  SKILL: 15,
  EXPERIENCE: 10,
  EDUCATION: 15,
  CONTACT: 20,
  EASTER_EGG: 50,
  GALLERY: 5
} as const; 
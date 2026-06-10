export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  image: string;
  video?: string;
  github?: string;
  live?: string;
  featured: boolean;
  category: 'web' | 'mobile' | 'desktop' | 'fullstack';
  year: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'design' | 'tools';
  level: number;
  icon: string;
  color: string;
  description: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
  type: 'full-time' | 'freelance' | 'contract';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  year: number;
  category: 'award' | 'certification' | 'speaking' | 'open-source' | 'milestone';
}

export interface SceneConfig {
  id: string;
  name: string;
  transitionIn: string;
  transitionOut: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface ScrollProgress {
  progress: number;
  section: string;
}

export type SectionId = 
  | 'loading' 
  | 'hero' 
  | 'about' 
  | 'skills' 
  | 'projects' 
  | 'experience' 
  | 'achievements' 
  | 'contact';

export interface PortfolioContent {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  email: string;
  github: string;
  linkedin: string;
  twitter?: string;
  resume?: string;
}

import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
}

interface ProjectStore {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [
    {
      id: '1',
      name: 'MODEE',
      description: 'MODEE project development and implementation',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      status: 'active'
    },
    {
      id: '2',
      name: 'Internship',
      description: 'Internship program management and coordination',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-15'),
      status: 'active'
    },
    {
      id: '3',
      name: 'PMIEF',
      description: 'PMIEF project development and oversight',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-30'),
      status: 'planning'
    },
    {
      id: '4',
      name: 'Aflatoun',
      description: 'Aflatoun initiative implementation',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-05-15'),
      status: 'active'
    },
    {
      id: '5',
      name: 'KTI',
      description: 'KTI project coordination and delivery',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-10-31'),
      status: 'planning'
    }
  ],

  addProject: (project) => set((state) => ({
    projects: [...state.projects, { ...project, id: Date.now().toString() }]
  })),

  updateProject: (id, project) => set((state) => ({
    projects: state.projects.map(proj => 
      proj.id === id ? { ...proj, ...project } : proj
    )
  })),

  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(proj => proj.id !== id)
  }))
}));

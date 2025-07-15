
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
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-04-30'),
      status: 'active'
    },
    {
      id: '2',
      name: 'Mobile App',
      description: 'New mobile application development',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-06-15'),
      status: 'active'
    },
    {
      id: '3',
      name: 'Data Analytics',
      description: 'Business intelligence dashboard',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-05-30'),
      status: 'planning'
    },
    {
      id: '4',
      name: 'API Integration',
      description: 'Third-party API integrations',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-15'),
      status: 'active'
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

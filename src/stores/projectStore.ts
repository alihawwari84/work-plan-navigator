
import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string; // employee ID
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  tasks: Task[];
}

interface ProjectStore {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (projectId: string, taskId: string, task: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  getProjectTasks: (projectId: string) => Task[];
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [
    {
      id: '1',
      name: 'MODEE',
      description: 'MODEE project development and implementation',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      status: 'active',
      tasks: [
        {
          id: '1',
          title: 'Setup development environment',
          description: 'Configure development tools and environments',
          status: 'done',
          priority: 'high',
          assignedTo: '1',
          dueDate: new Date('2024-02-01'),
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: '2',
          title: 'Design system architecture',
          description: 'Create technical specifications and architecture design',
          status: 'in-progress',
          priority: 'high',
          assignedTo: '2',
          dueDate: new Date('2024-03-15'),
          createdAt: new Date('2024-01-16'),
          updatedAt: new Date('2024-02-10')
        }
      ]
    },
    {
      id: '2',
      name: 'Internship',
      description: 'Internship program management and coordination',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-15'),
      status: 'active',
      tasks: [
        {
          id: '3',
          title: 'Recruit interns',
          description: 'Source and interview potential intern candidates',
          status: 'done',
          priority: 'medium',
          assignedTo: '4',
          dueDate: new Date('2024-02-15'),
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-14')
        }
      ]
    },
    {
      id: '3',
      name: 'PMIEF',
      description: 'PMIEF project development and oversight',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-30'),
      status: 'planning',
      tasks: [
        {
          id: '4',
          title: 'Project planning',
          description: 'Define project scope and timeline',
          status: 'todo',
          priority: 'high',
          assignedTo: '2',
          dueDate: new Date('2024-03-20'),
          createdAt: new Date('2024-03-01'),
          updatedAt: new Date('2024-03-01')
        }
      ]
    },
    {
      id: '4',
      name: 'Aflatoun',
      description: 'Aflatoun initiative implementation',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-05-15'),
      status: 'active',
      tasks: [
        {
          id: '5',
          title: 'Implementation review',
          description: 'Review current implementation and suggest improvements',
          status: 'in-progress',
          priority: 'medium',
          assignedTo: '3',
          dueDate: new Date('2024-04-01'),
          createdAt: new Date('2024-03-15'),
          updatedAt: new Date('2024-03-20')
        }
      ]
    },
    {
      id: '5',
      name: 'KTI',
      description: 'KTI project coordination and delivery',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-10-31'),
      status: 'planning',
      tasks: []
    }
  ],

  addProject: (project) => set((state) => ({
    projects: [...state.projects, { ...project, id: Date.now().toString(), tasks: [] }]
  })),

  updateProject: (id, project) => set((state) => ({
    projects: state.projects.map(proj => 
      proj.id === id ? { ...proj, ...project } : proj
    )
  })),

  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(proj => proj.id !== id)
  })),

  addTask: (projectId, task) => {
    console.log('Store addTask called with:', { projectId, task });
    console.log('Current projects:', get().projects.map(p => ({ id: p.id, name: p.name, tasksCount: p.tasks.length })));
    
    set((state) => {
      const updatedProjects = state.projects.map(proj => 
        proj.id === projectId 
          ? { 
              ...proj, 
              tasks: [...proj.tasks, { 
                ...task, 
                id: Date.now().toString(),
                createdAt: new Date(),
                updatedAt: new Date()
              }] 
            }
          : proj
      );
      
      console.log('Updated projects:', updatedProjects.map(p => ({ id: p.id, name: p.name, tasksCount: p.tasks.length })));
      
      return { projects: updatedProjects };
    });
  },

  updateTask: (projectId, taskId, task) => set((state) => ({
    projects: state.projects.map(proj => 
      proj.id === projectId 
        ? { 
            ...proj, 
            tasks: proj.tasks.map(t => 
              t.id === taskId ? { ...t, ...task, updatedAt: new Date() } : t
            )
          }
        : proj
    )
  })),

  deleteTask: (projectId, taskId) => set((state) => ({
    projects: state.projects.map(proj => 
      proj.id === projectId 
        ? { ...proj, tasks: proj.tasks.filter(t => t.id !== taskId) }
        : proj
    )
  })),

  getProjectTasks: (projectId) => {
    const project = get().projects.find(proj => proj.id === projectId);
    return project?.tasks || [];
  }
}));

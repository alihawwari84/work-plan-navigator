import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  tasks: Task[];
}

interface ProjectStore {
  projects: Project[];
  fetchProjects: () => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  addTask: (projectId: string, task: Omit<Task, 'id'>) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  fetchProjects: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, description, start_date, end_date, status, tasks');

    if (!error && data) {
      const formatted = data.map((project: any) => ({
        ...project,
        startDate: project.start_date ? new Date(project.start_date) : undefined,
        endDate: project.end_date ? new Date(project.end_date) : undefined,
        tasks: project.tasks || []
      }));
      set({ projects: formatted });
    }
  },
  addProject: async (projectData) => {
    console.log('Adding project:', projectData);
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: projectData.name,
        description: projectData.description,
        start_date: projectData.startDate?.toISOString(),
        end_date: projectData.endDate?.toISOString(),
        status: projectData.status || 'planning'
      })
      .select()
      .single();

    if (!error && data) {
      console.log('Project added successfully:', data);
      const newProject = {
        ...data,
        startDate: data.start_date ? new Date(data.start_date) : undefined,
        endDate: data.end_date ? new Date(data.end_date) : undefined,
        tasks: []
      };
      set((state) => ({ projects: [...state.projects, newProject] }));
    } else {
      console.error('Error adding project:', error);
    }
  },
  addTask: async (projectId, taskData) => {
    console.log('Adding task to project:', projectId, taskData);
    
    const taskId = crypto.randomUUID();
    const newTask = { id: taskId, ...taskData };
    
    const { error } = await supabase
      .from('tasks')
      .insert({
        id: taskId,
        project_id: projectId,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        assigned_to: taskData.assignedTo === 'unassigned' ? null : taskData.assignedTo,
        due_date: taskData.dueDate
      });

    if (!error) {
      console.log('Task added successfully');
      set((state) => ({
        projects: state.projects.map(project =>
          project.id === projectId
            ? { ...project, tasks: [...project.tasks, newTask] }
            : project
        )
      }));
    } else {
      console.error('Error adding task:', error);
    }
  },
  updateTask: async (projectId, taskId, updates) => {
    const { error } = await supabase
      .from('tasks')
      .update({
        title: updates.title,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        assigned_to: updates.assignedTo === 'unassigned' ? null : updates.assignedTo,
        due_date: updates.dueDate
      })
      .eq('id', taskId);

    if (!error) {
      set((state) => ({
        projects: state.projects.map(project =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map(task =>
                  task.id === taskId ? { ...task, ...updates } : task
                )
              }
            : project
        )
      }));
    }
  },
  deleteTask: async (projectId, taskId) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (!error) {
      set((state) => ({
        projects: state.projects.map(project =>
          project.id === projectId
            ? { ...project, tasks: project.tasks.filter(task => task.id !== taskId) }
            : project
        )
      }));
    }
  },
}));

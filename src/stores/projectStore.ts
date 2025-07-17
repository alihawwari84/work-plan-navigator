import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

interface Project {
  id: string;
  name: string;
}

interface ProjectStore {
  projects: Project[];
  fetchProjects: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  fetchProjects: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name');

    if (!error && data) {
      set({ projects: data });
    }
  },
}));

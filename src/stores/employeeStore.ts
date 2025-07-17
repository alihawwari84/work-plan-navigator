import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

interface Allocation {
  projectId: string;
  percentage: number;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  allocations: Allocation[];
}

interface EmployeeStore {
  employees: Employee[];
  fetchEmployees: () => void;
  updateAllocation: (employeeId: string, projectId: string, percentage: number) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  fetchEmployees: async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('id, name, department, allocations(project_id, percentage)');

    if (!error && data) {
      const formatted = data.map((emp: any) => ({
        ...emp,
        allocations: emp.allocations.map((a: any) => ({
          projectId: a.project_id,
          percentage: a.percentage,
        })),
      }));
      set({ employees: formatted });
    }
  },
  updateAllocation: async (employeeId, projectId, percentage) => {
    await supabase
      .from('allocations')
      .upsert({ employee_id: employeeId, project_id: projectId, percentage });

    // Optional: refresh employees after update
    const { data, error } = await supabase
      .from('employees')
      .select('id, name, department, allocations(project_id, percentage)');

    if (!error && data) {
      const formatted = data.map((emp: any) => ({
        ...emp,
        allocations: emp.allocations.map((a: any) => ({
          projectId: a.project_id,
          percentage: a.percentage,
        })),
      }));
      set({ employees: formatted });
    }
  }
}));

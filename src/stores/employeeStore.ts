import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

interface Allocation {
  projectId: string;
  percentage: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  allocations: Allocation[];
}

interface EmployeeStore {
  employees: Employee[];
  fetchEmployees: () => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateAllocation: (employeeId: string, projectId: string, percentage: number) => void;
  getTotalUtilization: (employeeId: string) => number;
  getUnderutilizedCount: () => number;
  getOverallocatedCount: () => number;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  fetchEmployees: async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('id, name, department, email, allocations(project_id, percentage)');

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
  addEmployee: async (employeeData) => {
    console.log('Adding employee:', employeeData);
    
    const { data, error } = await supabase
      .from('employees')
      .insert({
        name: employeeData.name,
        email: employeeData.email,
        department: employeeData.department
      })
      .select()
      .single();

    if (!error && data) {
      console.log('Employee added successfully:', data);
      const newEmployee = {
        ...data,
        allocations: []
      };
      set((state) => ({ employees: [...state.employees, newEmployee] }));
    } else {
      console.error('Error adding employee:', error);
    }
  },
  updateAllocation: async (employeeId, projectId, percentage) => {
    await supabase
      .from('allocations')
      .upsert({ employee_id: employeeId, project_id: projectId, percentage });

    // Optional: refresh employees after update
    const { data, error } = await supabase
      .from('employees')
      .select('id, name, department, email, allocations(project_id, percentage)');

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
  getTotalUtilization: (employeeId) => {
    const { employees } = get();
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return 0;
    return employee.allocations.reduce((total, alloc) => total + alloc.percentage, 0);
  },
  getUnderutilizedCount: () => {
    const { employees, getTotalUtilization } = get();
    return employees.filter(emp => getTotalUtilization(emp.id) < 50).length;
  },
  getOverallocatedCount: () => {
    const { employees, getTotalUtilization } = get();
    return employees.filter(emp => getTotalUtilization(emp.id) > 100).length;
  },
}));

import { create } from 'zustand';

export interface Allocation {
  projectId: string;
  percentage: number;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
  allocations: Allocation[];
}

interface EmployeeStore {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  updateAllocation: (employeeId: string, projectId: string, percentage: number) => void;
  getTotalUtilization: (employeeId: string) => number;
  getUnderutilizedCount: () => number;
  getOverallocatedCount: () => number;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [
    {
      id: '1',
      name: 'Sami Sunaa',
      department: 'Engineering',
      email: 'sami.sunaa@company.com',
      allocations: [
        { projectId: '1', percentage: 50 },
        { projectId: '2', percentage: 30 }
      ]
    },
    {
      id: '2',
      name: 'Lara Amaireh',
      department: 'Design',
      email: 'lara.amaireh@company.com',
      allocations: [
        { projectId: '1', percentage: 40 },
        { projectId: '3', percentage: 45 }
      ]
    },
    {
      id: '3',
      name: 'Tariq Qaisi',
      department: 'Engineering',
      email: 'tariq.qaisi@company.com',
      allocations: [
        { projectId: '2', percentage: 60 },
        { projectId: '4', percentage: 25 }
      ]
    },
    {
      id: '4',
      name: 'Dima Nabulsi',
      department: 'Product',
      email: 'dima.nabulsi@company.com',
      allocations: [
        { projectId: '3', percentage: 35 },
        { projectId: '5', percentage: 40 }
      ]
    }
  ],

  addEmployee: (employee) => set((state) => ({
    employees: [...state.employees, { ...employee, id: Date.now().toString() }]
  })),

  updateEmployee: (id, employee) => set((state) => ({
    employees: state.employees.map(emp => 
      emp.id === id ? { ...emp, ...employee } : emp
    )
  })),

  deleteEmployee: (id) => set((state) => ({
    employees: state.employees.filter(emp => emp.id !== id)
  })),

  updateAllocation: (employeeId, projectId, percentage) => set((state) => ({
    employees: state.employees.map(emp => {
      if (emp.id === employeeId) {
        const existingAllocationIndex = emp.allocations.findIndex(
          alloc => alloc.projectId === projectId
        );
        
        let newAllocations = [...emp.allocations];
        
        if (existingAllocationIndex >= 0) {
          if (percentage === 0) {
            // Remove allocation if percentage is 0
            newAllocations.splice(existingAllocationIndex, 1);
          } else {
            // Update existing allocation
            newAllocations[existingAllocationIndex] = { projectId, percentage };
          }
        } else if (percentage > 0) {
          // Add new allocation
          newAllocations.push({ projectId, percentage });
        }
        
        return { ...emp, allocations: newAllocations };
      }
      return emp;
    })
  })),

  getTotalUtilization: (employeeId) => {
    const employee = get().employees.find(emp => emp.id === employeeId);
    return employee?.allocations.reduce((sum, alloc) => sum + alloc.percentage, 0) || 0;
  },

  getUnderutilizedCount: () => {
    return get().employees.filter(emp => {
      const total = emp.allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
      return total < 50;
    }).length;
  },

  getOverallocatedCount: () => {
    return get().employees.filter(emp => {
      const total = emp.allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
      return total > 100;
    }).length;
  }
}));

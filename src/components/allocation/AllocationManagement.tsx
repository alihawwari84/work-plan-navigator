import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEmployeeStore } from '@/stores/employeeStore';
import { useProjectStore } from '@/stores/projectStore';
import { User, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const AllocationManagement = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [newAllocations, setNewAllocations] = useState<{ [projectId: string]: number }>({});
  
  const { employees, updateAllocation, getTotalUtilization } = useEmployeeStore();
  const { projects } = useProjectStore();
  
  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
  const currentUtilization = selectedEmployee ? getTotalUtilization(selectedEmployee.id) : 0;
  
  const getUtilizationStatus = (utilization: number) => {
    if (utilization > 100) return { status: 'overallocated', color: 'destructive' as const, icon: AlertCircle };
    if (utilization < 50) return { status: 'underutilized', color: 'secondary' as const, icon: Clock };
    return { status: 'optimal', color: 'default' as const, icon: CheckCircle };
  };

  const handleAllocationChange = (projectId: string, percentage: number) => {
    setNewAllocations(prev => ({
      ...prev,
      [projectId]: percentage
    }));
  };

  const handleSaveAllocations = () => {
    if (!selectedEmployee) return;
    
    Object.entries(newAllocations).forEach(([projectId, percentage]) => {
      updateAllocation(selectedEmployee.id, projectId, percentage);
    });
    
    setNewAllocations({});
  };

  const getCurrentAllocation = (projectId: string) => {
    if (!selectedEmployee) return 0;
    return selectedEmployee.allocations.find(alloc => alloc.projectId === projectId)?.percentage || 0;
  };

  const getDisplayAllocation = (projectId: string) => {
    return newAllocations[projectId] !== undefined 
      ? newAllocations[projectId] 
      : getCurrentAllocation(projectId);
  };

  const calculateNewUtilization = () => {
    if (!selectedEmployee) return 0;
    
    const baseAllocations = selectedEmployee.allocations.reduce((acc, alloc) => {
      if (newAllocations[alloc.projectId] === undefined) {
        acc += alloc.percentage;
      }
      return acc;
    }, 0);
    
    const newAllocationsSum = Object.values(newAllocations).reduce((acc, val) => acc + val, 0);
    return baseAllocations + newAllocationsSum;
  };

  const newUtilization = calculateNewUtilization();
  const utilizationInfo = getUtilizationStatus(newUtilization);
  const StatusIcon = utilizationInfo.icon;

  return (
    <div className="space-y-6">
      {/* Employee Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Employee Allocation Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee-select">Select Employee</Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an employee..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{employee.name}</span>
                        <span className="text-sm text-muted-foreground ml-4">
                          {employee.department}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Status & Allocation Interface */}
      {selectedEmployee && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Status Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{newUtilization}%</div>
                <Badge variant={utilizationInfo.color} className="flex items-center gap-1 w-fit mx-auto">
                  <StatusIcon className="h-3 w-3" />
                  {utilizationInfo.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Employee Details</div>
                <div className="text-sm text-muted-foreground">
                  <div>Name: {selectedEmployee.name}</div>
                  <div>Department: {selectedEmployee.department}</div>
                  <div>Email: {selectedEmployee.email}</div>
                </div>
              </div>

              {Object.keys(newAllocations).length > 0 && (
                <Button onClick={handleSaveAllocations} className="w-full">
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Project Allocations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Allocations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map(project => {
                    const currentAllocation = getCurrentAllocation(project.id);
                    const displayAllocation = getDisplayAllocation(project.id);
                    const hasChanges = newAllocations[project.id] !== undefined;
                    
                    return (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">{project.description}</div>
                          <Badge variant="outline" className="mt-1">
                            {project.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right min-w-0">
                            <Label htmlFor={`allocation-${project.id}`} className="text-sm">
                              Allocation %
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id={`allocation-${project.id}`}
                                type="number"
                                min="0"
                                max="100"
                                value={displayAllocation}
                                onChange={(e) => handleAllocationChange(project.id, parseInt(e.target.value) || 0)}
                                className="w-20 text-center"
                              />
                              {hasChanges && (
                                <Badge variant="secondary" className="text-xs">
                                  Changed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedEmployee && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Select an Employee</h3>
            <p className="text-muted-foreground">
              Choose an employee from the dropdown above to manage their project allocations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Edit3, Save, X } from 'lucide-react';
import { useEmployeeStore } from '@/stores/employeeStore';
import { useProjectStore } from '@/stores/projectStore';

export const AllocationTable = () => {
  const { employees, updateAllocation } = useEmployeeStore();
  const { projects } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCell, setEditingCell] = useState<{employeeId: string, projectId: string} | null>(null);
  const [editValue, setEditValue] = useState('');

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 50) return 'bg-yellow-100 text-yellow-800';
    if (utilization > 100) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const handleEdit = (employeeId: string, projectId: string, currentValue: number) => {
    setEditingCell({ employeeId, projectId });
    setEditValue(currentValue.toString());
  };

  const handleSave = () => {
    if (editingCell) {
      const newValue = parseFloat(editValue);
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
        updateAllocation(editingCell.employeeId, editingCell.projectId, newValue);
      }
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Employee Allocation Table</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-900">Employee</th>
                <th className="text-left p-4 font-semibold text-gray-900">Department</th>
                {projects.map(project => (
                  <th key={project.id} className="text-center p-4 font-semibold text-gray-900 min-w-24">
                    {project.name}
                  </th>
                ))}
                <th className="text-center p-4 font-semibold text-gray-900">Total %</th>
                <th className="text-center p-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => {
                const totalUtilization = employee.allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
                
                return (
                  <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{employee.name}</td>
                    <td className="p-4 text-gray-600">{employee.department}</td>
                    {projects.map(project => {
                      const allocation = employee.allocations.find(alloc => alloc.projectId === project.id);
                      const percentage = allocation?.percentage || 0;
                      const isEditing = editingCell?.employeeId === employee.id && editingCell?.projectId === project.id;
                      
                      return (
                        <td key={project.id} className="p-4 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-16 h-8 text-center"
                                min="0"
                                max="100"
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleSave}
                                className="h-8 w-8 p-0"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancel}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div 
                              className="flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-1"
                              onClick={() => handleEdit(employee.id, project.id, percentage)}
                            >
                              <span className="font-medium">{percentage}%</span>
                              {percentage > 0 && <Edit3 className="h-3 w-3 text-gray-400" />}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 text-center font-bold text-gray-900">{totalUtilization}%</td>
                    <td className="p-4 text-center">
                      <Badge className={getUtilizationColor(totalUtilization)}>
                        {totalUtilization < 50 ? 'Under' : totalUtilization > 100 ? 'Over' : 'Optimal'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

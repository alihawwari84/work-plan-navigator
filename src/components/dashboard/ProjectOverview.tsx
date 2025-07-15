
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FolderKanban, Calendar } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useEmployeeStore } from '@/stores/employeeStore';
import { format } from 'date-fns';

export const ProjectOverview = () => {
  const { projects } = useProjectStore();
  const { employees } = useEmployeeStore();

  const getProjectUtilization = (projectId: string) => {
    return employees.reduce((total, employee) => {
      const allocation = employee.allocations.find(alloc => alloc.projectId === projectId);
      return total + (allocation?.percentage || 0);
    }, 0);
  };

  const getProjectStatus = (startDate: Date, endDate: Date) => {
    const now = new Date();
    if (now < startDate) return { status: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    if (now > endDate) return { status: 'Completed', color: 'bg-gray-100 text-gray-800' };
    return { status: 'Active', color: 'bg-green-100 text-green-800' };
  };

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5" />
          Project Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto max-h-80">
        {projects.map(project => {
          const utilization = getProjectUtilization(project.id);
          const status = getProjectStatus(project.startDate, project.endDate);
          
          return (
            <div key={project.id} className="space-y-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{project.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    {format(project.startDate, 'MMM dd')} - {format(project.endDate, 'MMM dd, yyyy')}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={status.color}>
                    {status.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Resource Allocation</span>
                <span className="font-medium">{utilization}%</span>
              </div>
              <Progress 
                value={Math.min(utilization, 100)} 
                className="h-2"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

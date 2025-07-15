
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User } from 'lucide-react';
import { useEmployeeStore } from '@/stores/employeeStore';

export const EmployeeOverview = () => {
  const { employees } = useEmployeeStore();

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 50) return 'text-yellow-600';
    if (utilization > 100) return 'text-red-600';
    return 'text-green-600';
  };

  const getUtilizationBadgeColor = (utilization: number) => {
    if (utilization < 50) return 'bg-yellow-100 text-yellow-800';
    if (utilization > 100) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Employee Utilization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto max-h-80">
        {employees.map(employee => {
          const totalUtilization = employee.allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
          
          return (
            <div key={employee.id} className="space-y-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{employee.name}</p>
                  <p className="text-sm text-gray-600">{employee.department}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getUtilizationColor(totalUtilization)}`}>
                    {totalUtilization}%
                  </p>
                  <Badge className={`text-xs ${getUtilizationBadgeColor(totalUtilization)}`}>
                    {totalUtilization < 50 ? 'Under' : totalUtilization > 100 ? 'Over' : 'Optimal'}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={Math.min(totalUtilization, 100)} 
                className="h-2"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FolderKanban, AlertTriangle, TrendingUp } from 'lucide-react';
import { useEmployeeStore } from '@/stores/employeeStore';

const MetricsCards = () => {
  const {
    employees,
    getTotalUtilization,
    getUnderutilizedCount,
    getOverallocatedCount
  } = useEmployeeStore();

  const totalEmployees = employees.length;
  const totalProjects = new Set(
    employees.flatMap(emp => emp.allocations.map(alloc => alloc.projectId))
  ).size;
  const underutilized = getUnderutilizedCount?.() ?? 0;
  const overallocated = getOverallocatedCount?.() ?? 0;

  const metrics = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Projects",
      value: totalProjects,
      icon: FolderKanban,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Underutilized",
      value: underutilized,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Overallocated",
      value: overallocated,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsCards;

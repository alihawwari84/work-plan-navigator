
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useEmployeeStore } from '@/stores/employeeStore';

export const UtilizationChart = () => {
  const { employees } = useEmployeeStore();

  // Prepare data for bar chart
  const utilizationData = employees.map(employee => {
    const totalUtilization = employee.allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
    return {
      name: employee.name,
      utilization: totalUtilization,
      department: employee.department
    };
  });

  // Prepare data for pie chart
  const statusData = employees.reduce((acc, employee) => {
    const totalUtilization = employee.allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
    
    if (totalUtilization < 50) {
      acc.underutilized += 1;
    } else if (totalUtilization > 100) {
      acc.overallocated += 1;
    } else {
      acc.optimal += 1;
    }
    
    return acc;
  }, { underutilized: 0, optimal: 0, overallocated: 0 });

  const pieData = [
    { name: 'Optimal', value: statusData.optimal, color: '#10b981' },
    { name: 'Under-utilized', value: statusData.underutilized, color: '#f59e0b' },
    { name: 'Over-allocated', value: statusData.overallocated, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-600">
            Department: {payload[0]?.payload?.department}
          </p>
          <p className="text-sm">
            Utilization: <span className="font-medium">{payload[0]?.value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Employee Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="utilization" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Utilization Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

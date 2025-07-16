
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Users, FolderKanban, BarChart3, Settings } from 'lucide-react';
import { EmployeeOverview } from '@/components/dashboard/EmployeeOverview';
import { ProjectOverview } from '@/components/dashboard/ProjectOverview';
import { AllocationTable } from '@/components/dashboard/AllocationTable';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { UtilizationChart } from '@/components/dashboard/UtilizationChart';
import { AllocationManagement } from '@/components/allocation/AllocationManagement';
import { ProjectManagement } from '@/components/projects/ProjectManagement';
import { AddEmployeeDialog } from '@/components/dialogs/AddEmployeeDialog';
import { AddProjectDialog } from '@/components/dialogs/AddProjectDialog';

const Dashboard = () => {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Allocation Portal</h1>
            <p className="text-gray-600 mt-1">Manage employee allocations and project resources</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowAddEmployee(true)} className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Add Employee
            </Button>
            <Button onClick={() => setShowAddProject(true)} variant="outline" className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              Add Project
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <MetricsCards />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Manage Allocations
            </TabsTrigger>
            <TabsTrigger value="allocations" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              View Allocations
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmployeeOverview />
              <ProjectOverview />
            </div>
            <UtilizationChart />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <AllocationManagement />
          </TabsContent>

          <TabsContent value="allocations" className="space-y-6">
            <AllocationTable />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <ProjectManagement />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced reporting features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <AddEmployeeDialog open={showAddEmployee} onOpenChange={setShowAddEmployee} />
      <AddProjectDialog open={showAddProject} onOpenChange={setShowAddProject} />
    </div>
  );
};

export default Dashboard;

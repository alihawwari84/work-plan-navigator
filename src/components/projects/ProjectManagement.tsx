import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useProjectStore, Project, Task } from '@/stores/projectStore';
import { useEmployeeStore } from '@/stores/employeeStore';
import { TaskCard } from './TaskCard';
import { AddTaskDialog } from './AddTaskDialog';

export const ProjectManagement = () => {
  const { projects } = useProjectStore();
  const { employees } = useEmployeeStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'on-hold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskStats = (tasks: Task[]) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    
    return { total, completed, inProgress, todo, progress: total > 0 ? (completed / total) * 100 : 0 };
  };

  const getEmployeeName = (employeeId: string) => {
    return employees.find(emp => emp.id === employeeId)?.name || 'Unassigned';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Management</h2>
          <p className="text-muted-foreground">Manage projects and tasks</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Project Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const stats = getTaskStats(project.tasks);
              return (
                <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedProject(project)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant="secondary" className={`${getStatusColor(project.status)} text-white`}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{project.startDate.toLocaleDateString()} - {project.endDate.toLocaleDateString()}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(stats.progress)}%</span>
                        </div>
                        <Progress value={stats.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{stats.completed}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span>{stats.inProgress}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4 text-gray-500" />
                          <span>{stats.todo}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedProject ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {selectedProject.name}
                        <Badge variant="secondary" className={`${getStatusColor(selectedProject.status)} text-white`}>
                          {selectedProject.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">{selectedProject.description}</p>
                    </div>
                    <Button onClick={() => setShowAddTask(true)} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {getTaskStats(selectedProject.tasks).completed}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {getTaskStats(selectedProject.tasks).inProgress}
                      </div>
                      <div className="text-sm text-muted-foreground">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {getTaskStats(selectedProject.tasks).todo}
                      </div>
                      <div className="text-sm text-muted-foreground">To Do</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tasks</h3>
                {selectedProject.tasks.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground mb-4">No tasks yet</p>
                      <Button onClick={() => setShowAddTask(true)} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Task
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedProject.tasks.map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        projectId={selectedProject.id}
                        getEmployeeName={getEmployeeName}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Select a project from the Overview tab to view its details and manage tasks
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {selectedProject && (
        <AddTaskDialog 
          open={showAddTask} 
          onOpenChange={setShowAddTask}
          projectId={selectedProject.id}
          employees={employees}
        />
      )}
    </div>
  );
};
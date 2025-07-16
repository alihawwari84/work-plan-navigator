import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, User, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Task, useProjectStore } from '@/stores/projectStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditTaskDialog } from './EditTaskDialog';

interface TaskCardProps {
  task: Task;
  projectId: string;
  getEmployeeName: (employeeId: string) => string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, projectId, getEmployeeName }) => {
  const { deleteTask, updateTask } = useProjectStore();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'done': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'border-l-blue-500';
      case 'medium': return 'border-l-yellow-500';
      case 'high': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleStatusChange = (newStatus: 'todo' | 'in-progress' | 'done') => {
    updateTask(projectId, task.id, { status: newStatus });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(projectId, task.id);
    }
  };

  const isOverdue = task.dueDate && new Date() > task.dueDate && task.status !== 'done';

  return (
    <>
      <Card className={`border-l-4 ${getPriorityColor(task.priority)} ${isOverdue ? 'bg-red-50' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-muted-foreground">{task.description}</p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1">
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(task.status)} text-white text-xs cursor-pointer`}
                onClick={() => {
                  const statuses: ('todo' | 'in-progress' | 'done')[] = ['todo', 'in-progress', 'done'];
                  const currentIndex = statuses.indexOf(task.status);
                  const nextIndex = (currentIndex + 1) % statuses.length;
                  handleStatusChange(statuses[nextIndex]);
                }}
              >
                {task.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {task.priority}
              </Badge>
            </div>

            {task.assignedTo && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{getEmployeeName(task.assignedTo)}</span>
              </div>
            )}

            {task.dueDate && (
              <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                <Calendar className="h-3 w-3" />
                <span>{task.dueDate.toLocaleDateString()}</span>
                {isOverdue && <span className="font-medium">(Overdue)</span>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <EditTaskDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        task={task}
        projectId={projectId}
      />
    </>
  );
};
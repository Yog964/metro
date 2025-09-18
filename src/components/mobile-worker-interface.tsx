import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  User, 
  Wrench, 
  Sparkles,
  ArrowLeft,
  FileText,
  Package
} from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { mockWorkerTasks, WorkerTask } from '../data/mock-data';

interface MobileWorkerInterfaceProps {
  onPageChange: (page: string) => void;
}

export function MobileWorkerInterface({ onPageChange }: MobileWorkerInterfaceProps) {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<WorkerTask | null>(null);
  const [taskStatus, setTaskStatus] = useState<Record<string, 'assigned' | 'in_progress' | 'completed'>>({});

  const currentDateTime = new Date();
  
  // Filter tasks based on user role
  const userTasks = mockWorkerTasks.filter(task => {
    if (user?.role === 'worker_technician') {
      return task.type === 'maintenance' && task.assignedTo === user.name;
    }
    if (user?.role === 'worker_cleaning') {
      return task.type === 'cleaning' && task.assignedTo === user.name;
    }
    return false;
  });

  const handleStatusUpdate = (taskId: string, newStatus: 'assigned' | 'in_progress' | 'completed') => {
    setTaskStatus(prev => ({ ...prev, [taskId]: newStatus }));
    // In real implementation, this would update the backend
    console.log(`Updated task ${taskId} status to ${newStatus}`);
  };

  const getTaskStatus = (task: WorkerTask) => {
    return taskStatus[task.id] || task.status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return Clock;
    }
  };

  // Task detail view
  if (selectedTask) {
    const currentStatus = getTaskStatus(selectedTask);
    const PriorityIcon = getPriorityIcon(selectedTask.priority);
    
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedTask(null)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg">Task Details</h1>
            <p className="text-sm text-muted-foreground">
              {selectedTask.trainId} - {selectedTask.title}
            </p>
          </div>
        </div>

        {/* Task Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{selectedTask.title}</CardTitle>
              <Badge className={getPriorityColor(selectedTask.priority)}>
                <PriorityIcon className="h-3 w-3 mr-1" />
                {selectedTask.priority.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTask.bayNumber || 'To be assigned'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Estimated Time</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTask.estimatedTime} hours
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Description</p>
              <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
            </div>

            {selectedTask.notes && (
              <div>
                <p className="text-sm font-medium mb-2">Manager Notes</p>
                <p className="text-sm text-muted-foreground">{selectedTask.notes}</p>
              </div>
            )}

            {selectedTask.type === 'maintenance' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <Button variant="outline" size="sm" className="flex-1">
                    View TCMS Data
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <Button variant="outline" size="sm" className="flex-1">
                    View Analyser Report
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-500" />
                  <Button variant="outline" size="sm" className="flex-1">
                    Log Parts Used
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Update Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Update Task Status</CardTitle>
            <CardDescription>
              Current status: {currentStatus.replace('_', ' ')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentStatus === 'assigned' && (
                <Button 
                  className="w-full h-14 text-lg"
                  onClick={() => handleStatusUpdate(selectedTask.id, 'in_progress')}
                >
                  <Clock className="h-5 w-5 mr-2" />
                  Start Job
                </Button>
              )}

              {currentStatus === 'in_progress' && (
                <Button 
                  className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusUpdate(selectedTask.id, 'completed')}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Mark as Complete
                </Button>
              )}

              {currentStatus === 'completed' && (
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">Task Completed</p>
                  <p className="text-sm text-green-600">
                    Well done! The task has been marked as complete.
                  </p>
                </div>
              )}

              <Button 
                variant="outline" 
                className="w-full h-14 text-lg border-red-200 text-red-600 hover:bg-red-50"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                Report Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main task list view
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-5 w-5 text-blue-600" />
          <Badge variant="outline">
            {user?.role === 'worker_technician' ? 'Technician' : 'Cleaning Worker'}
          </Badge>
        </div>
        <h1 className="text-xl">My Tasks for {currentDateTime.toLocaleDateString('en-IN', { 
          weekday: 'long', 
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })}</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-medium text-blue-600">
              {userTasks.filter(t => getTaskStatus(t) === 'assigned').length}
            </div>
            <div className="text-xs text-muted-foreground">Assigned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-medium text-amber-600">
              {userTasks.filter(t => getTaskStatus(t) === 'in_progress').length}
            </div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-medium text-green-600">
              {userTasks.filter(t => getTaskStatus(t) === 'completed').length}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Job List */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Today's Job List</h2>
        
        {userTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">No tasks assigned for today</p>
              <p className="text-sm text-muted-foreground">Check back later for new assignments</p>
            </CardContent>
          </Card>
        ) : (
          userTasks.map((task) => {
            const currentStatus = getTaskStatus(task);
            const PriorityIcon = getPriorityIcon(task.priority);
            
            return (
              <Card 
                key={task.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{task.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {task.trainId}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          <PriorityIcon className="h-3 w-3 mr-1" />
                          {task.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={
                      currentStatus === 'completed' ? 'default' :
                      currentStatus === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {currentStatus === 'in_progress' ? 'In Progress' :
                       currentStatus === 'completed' ? 'Completed' : 'Assigned'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{task.bayNumber || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{task.estimatedTime}h</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {task.type === 'maintenance' ? (
                        <Wrench className="h-4 w-4" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      <span className="capitalize">{task.type}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {task.description}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
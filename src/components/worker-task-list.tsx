import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  MapPin,
  Wrench,
  Sparkles,
  Play,
  Check,
  User,
  Calendar
} from 'lucide-react';
import { mockWorkerTasks, WorkerTask } from '../data/mock-data';
import { useAuth } from '../contexts/auth-context';

export function WorkerTaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<WorkerTask[]>(mockWorkerTasks);

  const isWorker = user?.role === 'worker_technician' || user?.role === 'worker_cleaning';
  const userTasks = tasks.filter(task => 
    task.assignedTo === user?.name || 
    (task.type === 'maintenance' && user?.role === 'worker_technician') ||
    (task.type === 'cleaning' && user?.role === 'worker_cleaning')
  );

  const handleStatusUpdate = (taskId: string, newStatus: 'in_progress' | 'completed') => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus }
          : task
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'assigned': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'assigned': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'maintenance' ? <Wrench className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />;
  };

  const getTypeColor = (type: string) => {
    return type === 'maintenance' ? 'text-blue-600 bg-blue-50' : 'text-purple-600 bg-purple-50';
  };

  const assignedTasks = userTasks.filter(t => t.status === 'assigned');
  const inProgressTasks = userTasks.filter(t => t.status === 'in_progress');
  const completedTasks = userTasks.filter(t => t.status === 'completed');

  return (
    <div className="max-w-md mx-auto space-y-6 pb-6">
      {/* Header */}
      <div className="text-center px-4 pt-2">
        <h1 className="text-2xl">My Tasks</h1>
        <p className="text-sm text-muted-foreground">
          {user?.role === 'worker_technician' ? 'Maintenance Tasks' : 'Cleaning Tasks'}
        </p>
      </div>

      {/* User Info */}
      <Card className="mx-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || 'Worker'}</p>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'worker_technician' ? 'Technician' : 'Cleaning Worker'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Stats */}
      <Card className="mx-4">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-semibold text-gray-600">{assignedTasks.length}</div>
              <div className="text-xs text-muted-foreground">Assigned</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-blue-600">{inProgressTasks.length}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-green-600">{completedTasks.length}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4 px-4">
        {userTasks.length === 0 ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No tasks assigned at the moment. Check back later or contact your supervisor.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {userTasks
              .sort((a, b) => {
                // Sort by status (assigned first, then in_progress, then completed)
                const statusOrder = { 'assigned': 0, 'in_progress': 1, 'completed': 2 };
                return statusOrder[a.status] - statusOrder[b.status];
              })
              .map((task) => (
                <Card key={task.id} className="border-l-4" style={{
                  borderLeftColor: task.priority === 'high' ? '#ef4444' : 
                                  task.priority === 'medium' ? '#f59e0b' : '#10b981'
                }}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <div className={`p-1.5 rounded ${getTypeColor(task.type)}`}>
                            {getTypeIcon(task.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-medium truncate">{task.title}</h3>
                            <p className="text-xs text-muted-foreground">Train {task.trainId}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={getPriorityColor(task.priority)} variant="outline">
                            {task.priority.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(task.status)} variant="secondary">
                            <div className="flex items-center gap-1">
                              {getStatusIcon(task.status)}
                              <span className="text-xs">{task.status.replace('_', ' ').toUpperCase()}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground">{task.description}</p>

                      {/* Location & Time */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{task.bayNumber || 'Location TBD'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>~{task.estimatedTime}h</span>
                        </div>
                      </div>

                      {/* Assignment Info */}
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Assigned by {task.assignedBy}</span>
                          <span>• {task.assignedDate.toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Notes */}
                      {task.notes && (
                        <Alert className="py-2">
                          <AlertDescription className="text-xs">
                            <strong>Note:</strong> {task.notes}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Action Buttons */}
                      {task.status === 'assigned' && (
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                        >
                          <Play className="mr-2 h-3 w-3" />
                          Start Task
                        </Button>
                      )}

                      {task.status === 'in_progress' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-blue-100 rounded-full h-1">
                              <div 
                                className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
                                style={{ width: '75%' }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">In Progress</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full"
                            onClick={() => handleStatusUpdate(task.id, 'completed')}
                          >
                            <Check className="mr-2 h-3 w-3" />
                            Mark Complete
                          </Button>
                        </div>
                      )}

                      {task.status === 'completed' && (
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">Task Completed</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar,
  FileText,
  Award,
  Plus,
  User,
  Settings,
  Eye,
  Monitor,
  Brain,
  AlertCircle,
  Users,
  ClipboardList,
  Target
} from 'lucide-react';
import { mockTrains, mockAnalyserReports, mockWorkerTasks, WorkerTask } from '../data/mock-data';
import { useAuth } from '../contexts/auth-context';

export function MaintenanceHub() {
  const { user } = useAuth();
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', estimatedTime: 2 });
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [activeView, setActiveView] = useState('overview');

  const isWorkshopManager = user?.role === 'workshop_manager';
  const isMaintenanceManager = user?.role === 'maintenance_manager';
  const isWorker = user?.role === 'worker_technician';

  // Mock data for different views
  const certificates = [
    { id: 'CERT-001', trainId: 'TRN-003', type: 'Safety Certificate', expiryDate: new Date('2024-02-15'), status: 'expiring' },
    { id: 'CERT-002', trainId: 'TRN-001', type: 'Environmental Compliance', expiryDate: new Date('2024-03-20'), status: 'valid' },
    { id: 'CERT-003', trainId: 'TRN-005', type: 'Fire Safety', expiryDate: new Date('2024-01-28'), status: 'expired' },
  ];

  const jobCards = [
    { id: 'JC-001', trainId: 'TRN-003', description: 'HVAC System Repair', status: 'completed', completedDate: new Date('2024-01-20') },
    { id: 'JC-002', trainId: 'TRN-001', description: 'Brake Pad Replacement', status: 'in_progress', assignedTo: 'John Smith' },
    { id: 'JC-003', trainId: 'TRN-005', description: 'Door Motor Service', status: 'open', priority: 'high' },
  ];

  const workers = [
    { id: 'W001', name: 'John Smith', type: 'technician', activeTasks: 2, rating: 4.8 },
    { id: 'W002', name: 'Maria Garcia', type: 'cleaning', activeTasks: 1, rating: 4.9 },
    { id: 'W003', name: 'David Chen', type: 'technician', activeTasks: 0, rating: 4.7 },
    { id: 'W004', name: 'Sarah Wilson', type: 'cleaning', activeTasks: 3, rating: 4.6 },
  ];

  // Trains flagged by AI as needing maintenance
  const unfitTrains = mockAnalyserReports.filter(report => 
    report.recommendation === 'maintenance_required' || 
    (report.recommendation === 'replace' && report.defectsIdentified.length > 0)
  );

  const handleCreateTask = () => {
    if (!selectedTrain || !newTask.title || !selectedWorker) return;

    const task: WorkerTask = {
      id: `TASK-${Date.now()}`,
      trainId: selectedTrain,
      title: newTask.title,
      description: newTask.description,
      assignedBy: user?.name || 'Maintenance Manager',
      assignedTo: workers.find(w => w.id === selectedWorker)?.name || 'Unknown',
      priority: newTask.priority as 'low' | 'medium' | 'high',
      estimatedTime: newTask.estimatedTime,
      status: 'assigned',
      type: 'maintenance',
      assignedDate: new Date()
    };

    console.log('Created task:', task);
    
    // Reset form
    setNewTask({ title: '', description: '', priority: 'medium', estimatedTime: 2 });
    setSelectedTrain('');
    setSelectedWorker('');
  };

  const getCertificateColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-600 bg-green-50';
      case 'expiring': return 'text-yellow-600 bg-yellow-50';
      case 'expired': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getJobCardColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'open': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const WorkshopManagerView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Expiring Certificates</p>
                <p className="text-2xl">{certificates.filter(c => c.status === 'expiring').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Expired Certificates</p>
                <p className="text-2xl">{certificates.filter(c => c.status === 'expired').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Open Job Cards</p>
                <p className="text-2xl">{jobCards.filter(jc => jc.status === 'open').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certificate Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{cert.trainId}</div>
                    <div className="text-xs text-muted-foreground">{cert.type}</div>
                    <div className="text-xs text-muted-foreground">
                      Expires: {cert.expiryDate.toLocaleDateString()}
                    </div>
                  </div>
                  <Badge className={getCertificateColor(cert.status)}>
                    {cert.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Job Cards Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobCards.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{job.id}</div>
                    <div className="text-xs text-muted-foreground">{job.trainId}</div>
                    <div className="text-xs text-muted-foreground">{job.description}</div>
                    {job.assignedTo && (
                      <div className="text-xs text-muted-foreground">
                        Assigned to: {job.assignedTo}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge className={getJobCardColor(job.status)}>
                      {job.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {job.status === 'completed' && (
                      <Button size="sm" variant="outline" className="mt-2">
                        Close Job Card
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const MaintenanceManagerView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Unfit Trains</p>
                <p className="text-2xl">{unfitTrains.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-2xl">{mockWorkerTasks.filter(t => t.status === 'assigned').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Available Workers</p>
                <p className="text-2xl">{workers.filter(w => w.activeTasks === 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl">{mockWorkerTasks.filter(t => t.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Flagged Trains
            </CardTitle>
            <CardDescription>
              Trains identified as requiring maintenance by AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unfitTrains.map((report) => (
                <Card key={report.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{report.trainId}</div>
                          <div className="text-sm text-muted-foreground">
                            Risk Score: {Math.round(report.aiRiskScore * 100)}%
                          </div>
                        </div>
                        <Badge variant="destructive">
                          {report.recommendation.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Issues Identified:</h5>
                        {report.defectsIdentified.map((defect, index) => (
                          <div key={index} className="text-sm p-2 bg-red-50 rounded">
                            <div className="flex justify-between">
                              <span>{defect.system}</span>
                              <Badge size="sm" variant="outline">{defect.severity}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{defect.description}</p>
                            {defect.estimatedRepairTime > 0 && (
                              <p className="text-xs text-blue-600 mt-1">
                                Est. repair time: {defect.estimatedRepairTime}h
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full">
                        <Plus className="mr-2 h-3 w-3" />
                        Create Maintenance Task
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Create Maintenance Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Train</label>
              <Select value={selectedTrain} onValueChange={setSelectedTrain}>
                <SelectTrigger>
                  <SelectValue placeholder="Select train" />
                </SelectTrigger>
                <SelectContent>
                  {mockTrains.map((train) => (
                    <SelectItem key={train.id} value={train.id}>
                      {train.id} - {train.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Task Title</label>
              <Input
                placeholder="e.g., Replace HVAC filter"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Detailed task description..."
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Est. Time (hours)</label>
                <Input
                  type="number"
                  value={newTask.estimatedTime}
                  onChange={(e) => setNewTask({...newTask, estimatedTime: parseInt(e.target.value) || 2})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assign to Technician</label>
              <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {workers.filter(w => w.type === 'technician').map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.name} (Tasks: {worker.activeTasks})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCreateTask} className="w-full" disabled={!selectedTrain || !newTask.title || !selectedWorker}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1>Maintenance Hub</h1>
        <p className="text-muted-foreground">
          {isWorkshopManager 
            ? 'Certificate management and job card administration'
            : isMaintenanceManager 
              ? 'Task assignment and maintenance workflow management'
              : 'Comprehensive maintenance operations center'
          }
        </p>
      </div>

      {isWorkshopManager ? (
        <WorkshopManagerView />
      ) : isMaintenanceManager ? (
        <MaintenanceManagerView />
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="predictive">Predictive Alerts</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="jobs">Job Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Existing overview content would go here */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-muted-foreground">Critical Issues</p>
                      <p className="text-2xl">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Add other overview cards */}
            </div>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <MaintenanceManagerView />
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <WorkshopManagerView />
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            {/* Job cards content */}
            <Card>
              <CardHeader>
                <CardTitle>Active Job Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Train</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobCards.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-mono">{job.id}</TableCell>
                        <TableCell>{job.trainId}</TableCell>
                        <TableCell>{job.description}</TableCell>
                        <TableCell>
                          <Badge className={getJobCardColor(job.status)}>
                            {job.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{job.assignedTo || 'Unassigned'}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-3 w-3" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
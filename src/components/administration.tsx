import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Settings, Users, Activity, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock, Train, Wrench, Home, BarChart3, Database } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { mockTrains, mockDecisionLogs } from '../data/mock-data';

// Simple mock data to avoid performance issues
const mockSystemMetrics = {
  totalDecisions: 1247,
  successRate: 87.3,
  averageShuntingTime: 4.2,
  energySavings: 23.7,
  modelAccuracy: 91.2
};

const mockBayAllocations = [
  { id: 'BAY-001', bayNumber: 'Bay 1', type: 'standby', status: 'occupied', assignedTrainId: 'TRN-004' },
  { id: 'BAY-002', bayNumber: 'Bay 2', type: 'standby', status: 'occupied', assignedTrainId: 'TRN-005' },
  { id: 'BAY-003', bayNumber: 'Maintenance Bay 1', type: 'maintenance', status: 'occupied', assignedTrainId: 'TRN-002' },
  { id: 'BAY-004', bayNumber: 'Maintenance Bay 2', type: 'maintenance', status: 'available' },
  { id: 'BAY-005', bayNumber: 'Cleaning Bay 1', type: 'cleaning', status: 'available' },
  { id: 'BAY-006', bayNumber: 'Night Parking 1', type: 'night_parking', status: 'reserved' }
];

const mockMLFeedback = [
  {
    id: 'MLF-001',
    trainId: 'TRN-001',
    originalDecision: 'go_for_service',
    actualOutcome: 'successful',
    performanceMetrics: { shuntingTimeReduction: 15, serviceReliability: 98, energyEfficiency: 92 },
    feedback: 'Train performed excellently, no issues reported during service'
  },
  {
    id: 'MLF-002',
    trainId: 'TRN-003',
    originalDecision: 'replace',
    actualOutcome: 'partial_success',
    performanceMetrics: { shuntingTimeReduction: 8, serviceReliability: 85, energyEfficiency: 88 },
    feedback: 'Replacement was successful but minor comfort issue identified for future attention'
  }
];

export function Administration() {
  const { user } = useAuth();
  const [selectedBay, setSelectedBay] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Memoize expensive calculations
  const stats = useMemo(() => ({
    maintenanceBays: mockBayAllocations.filter(b => b.type === 'maintenance'),
    standbyBays: mockBayAllocations.filter(b => b.type === 'standby'),
    successfulOutcomes: mockMLFeedback.filter(f => f.actualOutcome === 'successful').length,
    totalFeedback: mockMLFeedback.length
  }), []);

  if (user?.role !== 'system_admin') {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2>Access Restricted</h2>
          <p className="text-muted-foreground">
            This section is only available to System Administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Administration & Reporting</h1>
          <p className="text-muted-foreground">
            System management, depot traffic control, and ML feedback analysis
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          System Admin
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="depot">Depot Traffic</TabsTrigger>
          <TabsTrigger value="ml-feedback">ML Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Decisions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{mockSystemMetrics.totalDecisions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{mockSystemMetrics.successRate}%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Model Accuracy</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{mockSystemMetrics.modelAccuracy}%</div>
                <p className="text-xs text-muted-foreground">
                  Updated 3 days ago
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Energy Savings</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{mockSystemMetrics.energySavings}%</div>
                <p className="text-xs text-muted-foreground">
                  vs. manual operations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDecisionLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Train className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{log.trainId} - {log.decision.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.terminal} • {log.supervisorName}
                        </p>
                      </div>
                    </div>
                    <Badge variant={log.decision === 'go_for_service' ? 'default' : 'secondary'}>
                      {log.decision.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Depot Traffic Management Tab */}
        <TabsContent value="depot" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2>Depot Traffic Management</h2>
              <p className="text-muted-foreground">
                Manage bay allocations for maintenance, standby, and night parking
              </p>
            </div>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Configure Bays
            </Button>
          </div>

          {/* Bay Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Maintenance Bays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stats.maintenanceBays.filter(b => b.status === 'available').length}/{stats.maintenanceBays.length}</div>
                <p className="text-xs text-muted-foreground">Available/Total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Standby Bays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stats.standbyBays.filter(b => b.status === 'available').length}/{stats.standbyBays.length}</div>
                <p className="text-xs text-muted-foreground">Available/Total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Bays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{mockBayAllocations.length}</div>
                <p className="text-xs text-muted-foreground">Configured bays</p>
              </CardContent>
            </Card>
          </div>

          {/* Bay Allocation Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Bay Allocations</CardTitle>
              <CardDescription>
                Click on a bay to view details or make changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockBayAllocations.map((bay) => {
                  const IconComponent = bay.type === 'maintenance' ? Wrench : 
                                      bay.type === 'standby' ? Clock :
                                      bay.type === 'night_parking' ? Home : Activity;
                  const assignedTrain = bay.assignedTrainId ? mockTrains.find(t => t.id === bay.assignedTrainId) : null;
                  
                  return (
                    <div
                      key={bay.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedBay === bay.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedBay(selectedBay === bay.id ? null : bay.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span className="font-medium">{bay.bayNumber}</span>
                        </div>
                        <Badge variant={bay.status === 'occupied' ? 'destructive' : 
                                       bay.status === 'reserved' ? 'secondary' : 'default'}>
                          {bay.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground capitalize">
                          {bay.type.replace('_', ' ')}
                        </p>
                        
                        {assignedTrain && (
                          <p className="text-sm">
                            <span className="font-medium">{assignedTrain.name}</span>
                            <br />
                            <span className="text-muted-foreground">{bay.assignedTrainId}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ML Feedback Loop Tab */}
        <TabsContent value="ml-feedback" className="space-y-6">
          <div>
            <h2>ML Feedback Loop Interface</h2>
            <p className="text-muted-foreground">
              Track outcomes of AI recommendations and improve model performance
            </p>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Successful Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-green-600">{stats.successfulOutcomes}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.successfulOutcomes / stats.totalFeedback) * 100)}% success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg Shunting Time Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">12%</div>
                <p className="text-xs text-muted-foreground">
                  Compared to manual operations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Service Reliability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">92%</div>
                <p className="text-xs text-muted-foreground">
                  Average across all decisions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Energy Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">90%</div>
                <p className="text-xs text-muted-foreground">
                  Optimal bay assignments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback Entries</CardTitle>
              <CardDescription>
                Outcomes and performance data from implemented recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMLFeedback.map((feedback) => {
                  const OutcomeIcon = feedback.actualOutcome === 'successful' ? CheckCircle : 
                                     feedback.actualOutcome === 'partial_success' ? AlertTriangle : XCircle;
                  
                  return (
                    <div key={feedback.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${feedback.actualOutcome === 'successful' ? 'bg-green-100' : 'bg-amber-100'}`}>
                            <OutcomeIcon className={`h-4 w-4 ${feedback.actualOutcome === 'successful' ? 'text-green-600' : 'text-amber-600'}`} />
                          </div>
                          <div>
                            <p className="font-medium">{feedback.trainId} - {feedback.originalDecision.replace('_', ' ')}</p>
                            <p className="text-sm text-muted-foreground">Completed recently</p>
                          </div>
                        </div>
                        <Badge variant={feedback.actualOutcome === 'successful' ? 'default' : 'secondary'}>
                          {feedback.actualOutcome.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Shunting Time</p>
                          <p className="text-sm font-medium">
                            -{feedback.performanceMetrics.shuntingTimeReduction}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Reliability</p>
                          <p className="text-sm font-medium">
                            {feedback.performanceMetrics.serviceReliability}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Energy Efficiency</p>
                          <p className="text-sm font-medium">
                            {feedback.performanceMetrics.energyEfficiency}%
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <p className="text-sm text-muted-foreground">
                          {feedback.feedback}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div>
            <h2>System Analytics</h2>
            <p className="text-muted-foreground">
              Detailed performance metrics and trend analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Accuracy</span>
                      <span className="text-sm">{mockSystemMetrics.modelAccuracy}%</span>
                    </div>
                    <Progress value={mockSystemMetrics.modelAccuracy} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm">{mockSystemMetrics.successRate}%</span>
                    </div>
                    <Progress value={mockSystemMetrics.successRate} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Energy Savings</span>
                      <span className="text-sm">{mockSystemMetrics.energySavings}%</span>
                    </div>
                    <Progress value={mockSystemMetrics.energySavings} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Decision Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Go for Service</span>
                    <Badge variant="default">78%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Maintenance Required</span>
                    <Badge variant="secondary">15%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Replace</span>
                    <Badge variant="outline">7%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2>User Management</h2>
              <p className="text-muted-foreground">
                Manage system users and role assignments
              </p>
            </div>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Operations Supervisor</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Mike Chen</p>
                    <p className="text-sm text-muted-foreground">Workshop Manager</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Lisa Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Depot Manager</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
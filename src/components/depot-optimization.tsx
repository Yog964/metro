import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Zap, 
  MapPin, 
  TrendingDown, 
  TrendingUp, 
  Gauge, 
  Calendar,
  BarChart3,
  Route,
  Clock,
  Leaf,
  Map
} from 'lucide-react';
import { mockTrains, getDepotLocations, getInfrastructureLocations } from '../data/mock-data';
import { MapComponent, MapLocation } from './map-component';

export function DepotOptimization() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock energy data
  const energyData = {
    todayConsumption: 2847,
    baselineConsumption: 3240,
    savingsPercentage: 12.1,
    monthlyTrend: [
      { month: 'Jan', consumption: 3100, savings: 8.2 },
      { month: 'Feb', consumption: 2980, savings: 10.5 },
      { month: 'Mar', consumption: 2850, savings: 12.8 },
      { month: 'Apr', consumption: 2920, savings: 11.3 },
      { month: 'May', consumption: 2780, savings: 14.2 },
      { month: 'Jun', consumption: 2847, savings: 12.1 }
    ]
  };

  // Mock bay assignments
  const bayAssignments = [
    { bayId: 'Bay 1', currentTrain: 'TRN-004', nextAssignment: 'TRN-001', estimatedTime: '14:30', energyImpact: 'Low' },
    { bayId: 'Bay 2', currentTrain: 'TRN-005', nextAssignment: null, estimatedTime: '15:45', energyImpact: 'None' },
    { bayId: 'Bay 3', currentTrain: 'TRN-001', nextAssignment: 'TRN-003', estimatedTime: '16:15', energyImpact: 'Medium' },
    { bayId: 'Bay 4', currentTrain: null, nextAssignment: 'TRN-002', estimatedTime: '13:20', energyImpact: 'High' },
    { bayId: 'Bay 5', currentTrain: null, nextAssignment: null, estimatedTime: null, energyImpact: 'None' }
  ];

  // Mock dynamic assignments
  const dynamicAssignments = [
    {
      id: 'DA-001',
      trainId: 'TRN-003',
      originalRoute: 'Route 1',
      newRoute: 'Route 2',
      reason: 'Weather conditions - increased passenger demand',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      energyImpact: '+5% efficiency',
      status: 'Active'
    },
    {
      id: 'DA-002',
      trainId: 'TRN-001',
      originalRoute: 'Route 3',
      newRoute: 'Route 1',
      reason: 'Special event - stadium match traffic optimization',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      energyImpact: '+8% efficiency',
      status: 'Completed'
    },
    {
      id: 'DA-003',
      trainId: 'TRN-005',
      originalRoute: 'Route 2',
      newRoute: 'Route 3',
      reason: 'Traffic optimization - reduced congestion',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      energyImpact: '+3% efficiency',
      status: 'Completed'
    }
  ];

  const getEnergyImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      case 'None': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Depot Optimization</h1>
        <p className="text-muted-foreground">
          Energy savings and operational efficiency management
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingDown className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Energy Savings</p>
                <p className="text-2xl">{energyData.savingsPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Today's Consumption</p>
                <p className="text-2xl">{energyData.todayConsumption}</p>
                <p className="text-xs text-muted-foreground">kWh</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Route className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Active Optimizations</p>
                <p className="text-2xl">
                  {dynamicAssignments.filter(da => da.status === 'Active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Leaf className="h-4 w-4 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">CO2 Saved</p>
                <p className="text-2xl">1.2</p>
                <p className="text-xs text-muted-foreground">tons</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Energy Overview</TabsTrigger>
          <TabsTrigger value="map">Depot Map</TabsTrigger>
          <TabsTrigger value="bays">Bay Management</TabsTrigger>
          <TabsTrigger value="assignments">Dynamic Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Energy Consumption Trends
                </CardTitle>
                <CardDescription>
                  Monthly energy consumption vs baseline with AI optimization savings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {energyData.monthlyTrend.map((month) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{month.month}</span>
                        <div className="flex gap-4">
                          <span>{month.consumption} kWh</span>
                          <span className="text-green-600">-{month.savings}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={85} className="h-2" />
                        <Progress value={85 - month.savings} className="h-2 bg-green-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Optimization Impact
                </CardTitle>
                <CardDescription>
                  Real-time impact of AI-driven shunting strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">{energyData.savingsPercentage}%</div>
                  <p className="text-muted-foreground">Energy Reduction vs Baseline</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm">Saved Today</span>
                    <span className="font-mono">{energyData.baselineConsumption - energyData.todayConsumption} kWh</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm">Equivalent CO2 Reduction</span>
                    <span className="font-mono">1.2 tons</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm">Cost Savings (Est.)</span>
                    <span className="font-mono">$247</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>
                AI-generated suggestions for further energy efficiency improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span>High Impact Recommendation</span>
                  </div>
                  <p className="text-sm mb-2">
                    Implementing off-peak charging schedule could reduce energy costs by an additional 8%
                  </p>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Route className="h-4 w-4 text-yellow-600" />
                    <span>Medium Impact Recommendation</span>
                  </div>
                  <p className="text-sm mb-2">
                    Optimizing bay 4 positioning could reduce locomotive movement by 15%
                  </p>
                  <Button size="sm" variant="outline">
                    Implement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Depot Infrastructure Map
              </CardTitle>
              <CardDescription>
                Interactive map showing depot locations, maintenance facilities, and optimization zones
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <MapComponent
                  locations={getInfrastructureLocations()}
                  center={[9.9312, 76.2673]}
                  zoom={12}
                  height="500px"
                  showControls={true}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Energy Zones</CardTitle>
                <CardDescription>
                  Color-coded energy efficiency zones across the depot network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="text-sm">High Efficiency Zone</span>
                    </div>
                    <span className="text-sm font-mono">Muttom Depot, Pettah Terminal</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                      <span className="text-sm">Medium Efficiency Zone</span>
                    </div>
                    <span className="text-sm font-mono">Aluva Terminal</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <span className="text-sm">Optimization Needed</span>
                    </div>
                    <span className="text-sm font-mono">Kalamassery Maintenance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Depot Statistics</CardTitle>
                <CardDescription>
                  Real-time statistics for each depot location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Muttom Depot Utilization</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Aluva Terminal Utilization</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pettah Terminal Utilization</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Maintenance Capacity</span>
                      <span>40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bays" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Bay & Shunting Optimization
              </CardTitle>
              <CardDescription>
                Real-time depot layout and AI-optimized bay assignment plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">Interactive depot layout visualization</p>
                    <p className="text-sm text-gray-400">
                      Real-time bay assignments and movement optimization
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bay ID</TableHead>
                      <TableHead>Current Train</TableHead>
                      <TableHead>Next Assignment</TableHead>
                      <TableHead>Estimated Time</TableHead>
                      <TableHead>Energy Impact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bayAssignments.map((bay) => (
                      <TableRow key={bay.bayId}>
                        <TableCell className="font-mono">{bay.bayId}</TableCell>
                        <TableCell>
                          {bay.currentTrain ? (
                            <Badge variant="default">{bay.currentTrain}</Badge>
                          ) : (
                            <Badge variant="secondary">Empty</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {bay.nextAssignment ? (
                            <Badge variant="outline">{bay.nextAssignment}</Badge>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {bay.estimatedTime ? (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {bay.estimatedTime}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getEnergyImpactColor(bay.energyImpact)}>
                            {bay.energyImpact}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Optimize
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Dynamic Route Assignments
              </CardTitle>
              <CardDescription>
                AI-driven route reassignments based on traffic, weather, and special events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dynamicAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="flex items-center gap-2">
                          <span className="font-mono">{assignment.trainId}</span>
                          <span className="text-muted-foreground">•</span>
                          <span>Route Change</span>
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{assignment.originalRoute}</span>
                          <span>→</span>
                          <span>{assignment.newRoute}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={assignment.status === 'Active' ? 'default' : 'secondary'}>
                          {assignment.status}
                        </Badge>
                        <Badge variant="outline" className="text-green-600">
                          {assignment.energyImpact}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3">{assignment.reason}</p>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{assignment.timestamp.toLocaleString()}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignment Rules</CardTitle>
              <CardDescription>
                Configure parameters for automatic route optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Weather Sensitivity</label>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Trigger reassignments on weather conditions
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm">Traffic Optimization</label>
                    <Progress value={90} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Priority for traffic-based optimizations
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm">Event Response</label>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Automatic response to special events
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm">Energy Priority</label>
                    <Progress value={60} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Weight energy efficiency in decisions
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button>Update Assignment Rules</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
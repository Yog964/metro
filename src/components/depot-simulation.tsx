import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  Settings,
  BarChart3,
  Target,
  Eye,
  Users,
  Calendar
} from 'lucide-react';
import { mockTrains } from '../data/mock-data';
import { Train } from '../types/train';

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  changes: Array<{
    trainId: string;
    currentStatus: string;
    newStatus: string;
    reason: string;
  }>;
}

interface SimulationResult {
  fleetReadiness: number;
  serviceCapacity: number;
  maintenanceBacklog: number;
  energyEfficiency: number;
  recommendations: string[];
  warnings: string[];
  rankedInductionList: Array<{
    trainId: string;
    priority: number;
    readiness: number;
    reason: string;
  }>;
}

export function DepotSimulation() {
  const [selectedTrains, setSelectedTrains] = useState<string[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);
  const [baselineResult, setBaselineResult] = useState<SimulationResult | null>(null);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(null);

  // Mock simulation scenarios
  const scenarios: SimulationScenario[] = [
    {
      id: 'branding_event',
      name: 'Special Event Branding',
      description: 'Two trains unavailable for special event branding',
      changes: [
        {
          trainId: 'TRN-002',
          currentStatus: 'go_for_service',
          newStatus: 'branding_unavailable',
          reason: 'Special event branding requirement'
        },
        {
          trainId: 'TRN-004',
          currentStatus: 'standby',
          newStatus: 'branding_unavailable',
          reason: 'Special event branding requirement'
        }
      ]
    },
    {
      id: 'maintenance_surge',
      name: 'Maintenance Surge',
      description: 'Three additional trains require maintenance',
      changes: [
        {
          trainId: 'TRN-001',
          currentStatus: 'go_for_service',
          newStatus: 'maintenance_required',
          reason: 'Preventive maintenance schedule'
        },
        {
          trainId: 'TRN-003',
          currentStatus: 'standby',
          newStatus: 'maintenance_required',
          reason: 'HVAC system inspection needed'
        },
        {
          trainId: 'TRN-005',
          currentStatus: 'go_for_service',
          newStatus: 'maintenance_required',
          reason: 'Brake system service due'
        }
      ]
    },
    {
      id: 'peak_demand',
      name: 'Peak Demand Period',
      description: 'Maximum fleet utilization scenario',
      changes: [
        {
          trainId: 'TRN-006',
          currentStatus: 'standby',
          newStatus: 'go_for_service',
          reason: 'Peak demand activation'
        },
        {
          trainId: 'TRN-007',
          currentStatus: 'standby',
          newStatus: 'go_for_service',
          reason: 'Peak demand activation'
        }
      ]
    }
  ];

  // Calculate simulation results
  const calculateResults = (trainStatuses: Record<string, string>): SimulationResult => {
    const trains = mockTrains.map(train => ({
      ...train,
      status: trainStatuses[train.id] || train.status
    }));

    const operational = trains.filter(t => trainStatuses[t.id] === 'go_for_service' || (!trainStatuses[t.id] && t.status === 'go_for_service')).length;
    const maintenance = trains.filter(t => trainStatuses[t.id] === 'maintenance_required' || trainStatuses[t.id] === 'inspection_required' || (!trainStatuses[t.id] && t.status === 'inspection_required')).length;
    const standby = trains.filter(t => trainStatuses[t.id] === 'standby' || (!trainStatuses[t.id] && t.status === 'standby')).length;
    const unavailable = trains.filter(t => trainStatuses[t.id] === 'branding_unavailable').length;

    const totalTrains = trains.length;
    const fleetReadiness = Math.round((operational / totalTrains) * 100);
    const serviceCapacity = Math.round(((operational + standby) / totalTrains) * 100);
    const maintenanceBacklog = maintenance;
    const energyEfficiency = Math.max(60, 95 - (maintenance * 2) - (unavailable * 3));

    // Generate ranked induction list
    const rankedList = trains
      .filter(t => trainStatuses[t.id] === 'go_for_service' || (!trainStatuses[t.id] && t.status === 'go_for_service'))
      .sort((a, b) => {
        // Sort by AI risk score (lower is better), then by mileage deficit
        if (a.aiRiskScore !== b.aiRiskScore) {
          return a.aiRiskScore - b.aiRiskScore;
        }
        return b.totalMileage - a.totalMileage;
      })
      .slice(0, 6)
      .map((train, index) => ({
        trainId: train.id,
        priority: index + 1,
        readiness: Math.round(100 - (train.aiRiskScore * 100)),
        reason: `Risk: ${Math.round(train.aiRiskScore * 100)}%, Mileage: ${train.totalMileage.toLocaleString()}km`
      }));

    // Generate recommendations and warnings
    const recommendations: string[] = [];
    const warnings: string[] = [];

    if (fleetReadiness < 70) {
      warnings.push(`Low fleet readiness (${fleetReadiness}%) - consider reducing maintenance window`);
    }
    if (maintenance > 3) {
      warnings.push(`High maintenance backlog (${maintenance} trains) - may impact service`);
    }
    if (unavailable > 2) {
      warnings.push(`Multiple trains unavailable (${unavailable}) - monitor service gaps`);
    }

    if (standby > 2) {
      recommendations.push('Consider activating standby trains to improve fleet readiness');
    }
    if (energyEfficiency > 90) {
      recommendations.push('Excellent energy efficiency - maintain current operations');
    }
    if (operational >= totalTrains * 0.8) {
      recommendations.push('Fleet utilization optimal for current demand');
    }

    return {
      fleetReadiness,
      serviceCapacity,
      maintenanceBacklog,
      energyEfficiency,
      recommendations,
      warnings,
      rankedInductionList: rankedList
    };
  };

  // Get baseline results on mount
  useEffect(() => {
    const baseline = calculateResults({});
    setBaselineResult(baseline);
    setCurrentResult(baseline);
  }, []);

  const runSimulation = async (scenario?: SimulationScenario) => {
    setSimulationRunning(true);
    setActiveScenario(scenario || null);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    let trainChanges: Record<string, string> = {};

    if (scenario) {
      // Apply scenario changes
      scenario.changes.forEach(change => {
        trainChanges[change.trainId] = change.newStatus;
      });
    } else {
      // Apply manual selections
      selectedTrains.forEach(trainId => {
        trainChanges[trainId] = 'branding_unavailable';
      });
    }

    const result = calculateResults(trainChanges);
    setCurrentResult(result);
    setSimulationRunning(false);
  };

  const resetSimulation = () => {
    setSelectedTrains([]);
    setActiveScenario(null);
    setCurrentResult(baselineResult);
  };

  const toggleTrainSelection = (trainId: string) => {
    setSelectedTrains(prev => 
      prev.includes(trainId) 
        ? prev.filter(id => id !== trainId)
        : [...prev, trainId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'go_for_service': return 'text-green-600 bg-green-50';
      case 'standby': return 'text-yellow-600 bg-yellow-50';
      case 'inspection_required': return 'text-red-600 bg-red-50';
      case 'maintenance_required': return 'text-orange-600 bg-orange-50';
      case 'branding_unavailable': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'go_for_service': return 'Operational';
      case 'standby': return 'Standby';
      case 'inspection_required': return 'Inspection';
      case 'maintenance_required': return 'Maintenance';
      case 'branding_unavailable': return 'Branding';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Fleet Simulation Tool</h1>
        <p className="text-muted-foreground">
          Strategic planning and "what-if" scenario analysis for fleet management
        </p>
      </div>

      <Tabs defaultValue="scenarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="custom">Custom Simulation</TabsTrigger>
          <TabsTrigger value="results">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Predefined Scenarios
                </CardTitle>
                <CardDescription>
                  Run common operational scenarios to test fleet resilience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scenarios.map((scenario) => (
                  <Card key={scenario.id} className={`cursor-pointer transition-colors ${
                    activeScenario?.id === scenario.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{scenario.name}</h4>
                          <Badge variant="outline">
                            {scenario.changes.length} changes
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => runSimulation(scenario)}
                          disabled={simulationRunning}
                        >
                          {simulationRunning && activeScenario?.id === scenario.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-3 w-3" />
                              Run Scenario
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Current Results Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Current Fleet Status
                  {activeScenario && (
                    <Badge variant="secondary" className="ml-2">
                      {activeScenario.name}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentResult && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-semibold text-green-600">{currentResult.fleetReadiness}%</div>
                        <div className="text-sm text-muted-foreground">Fleet Readiness</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-semibold text-blue-600">{currentResult.serviceCapacity}%</div>
                        <div className="text-sm text-muted-foreground">Service Capacity</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-semibold text-orange-600">{currentResult.maintenanceBacklog}</div>
                        <div className="text-sm text-muted-foreground">Maintenance Queue</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-semibold text-purple-600">{currentResult.energyEfficiency}%</div>
                        <div className="text-sm text-muted-foreground">Energy Efficiency</div>
                      </div>
                    </div>

                    {currentResult.warnings.length > 0 && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            {currentResult.warnings.map((warning, index) => (
                              <div key={index}>• {warning}</div>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {currentResult.recommendations.length > 0 && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            {currentResult.recommendations.map((rec, index) => (
                              <div key={index}>• {rec}</div>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button variant="outline" onClick={resetSimulation} className="w-full">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Baseline
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Custom Fleet Simulation
              </CardTitle>
              <CardDescription>
                Select specific trains to modify their status and see the impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mockTrains.map((train) => (
                  <Card 
                    key={train.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTrains.includes(train.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => toggleTrainSelection(train.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{train.id}</div>
                          <div className="text-xs text-muted-foreground">{train.name}</div>
                        </div>
                        <Badge className={getStatusColor(train.status)} variant="secondary">
                          {getStatusText(train.status)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => runSimulation()}
                  disabled={selectedTrains.length === 0 || simulationRunning}
                  className="flex-1"
                >
                  {simulationRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Simulation ({selectedTrains.length} selected)
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setSelectedTrains([])}>
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {currentResult && (
            <>
              {/* Comparison with Baseline */}
              {baselineResult && activeScenario && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Simulation Impact Analysis
                    </CardTitle>
                    <CardDescription>
                      Comparison between baseline and {activeScenario.name} scenario
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Fleet Readiness</div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">{currentResult.fleetReadiness}%</span>
                          <div className={`flex items-center gap-1 text-sm ${
                            currentResult.fleetReadiness >= baselineResult.fleetReadiness 
                              ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {currentResult.fleetReadiness >= baselineResult.fleetReadiness ? 
                              <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {currentResult.fleetReadiness - baselineResult.fleetReadiness > 0 ? '+' : ''}
                            {currentResult.fleetReadiness - baselineResult.fleetReadiness}%
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Service Capacity</div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">{currentResult.serviceCapacity}%</span>
                          <div className={`flex items-center gap-1 text-sm ${
                            currentResult.serviceCapacity >= baselineResult.serviceCapacity 
                              ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {currentResult.serviceCapacity >= baselineResult.serviceCapacity ? 
                              <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {currentResult.serviceCapacity - baselineResult.serviceCapacity > 0 ? '+' : ''}
                            {currentResult.serviceCapacity - baselineResult.serviceCapacity}%
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Maintenance Queue</div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">{currentResult.maintenanceBacklog}</span>
                          <div className={`flex items-center gap-1 text-sm ${
                            currentResult.maintenanceBacklog <= baselineResult.maintenanceBacklog 
                              ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {currentResult.maintenanceBacklog <= baselineResult.maintenanceBacklog ? 
                              <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {currentResult.maintenanceBacklog - baselineResult.maintenanceBacklog > 0 ? '+' : ''}
                            {currentResult.maintenanceBacklog - baselineResult.maintenanceBacklog}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Energy Efficiency</div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">{currentResult.energyEfficiency}%</span>
                          <div className={`flex items-center gap-1 text-sm ${
                            currentResult.energyEfficiency >= baselineResult.energyEfficiency 
                              ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {currentResult.energyEfficiency >= baselineResult.energyEfficiency ? 
                              <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {currentResult.energyEfficiency - baselineResult.energyEfficiency > 0 ? '+' : ''}
                            {currentResult.energyEfficiency - baselineResult.energyEfficiency}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ranked Induction List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI-Optimized Induction List
                  </CardTitle>
                  <CardDescription>
                    Recommended train priority order based on risk analysis and operational metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentResult.rankedInductionList.map((item, index) => (
                      <div key={item.trainId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold">
                            {item.priority}
                          </div>
                          <div>
                            <div className="font-medium">{item.trainId}</div>
                            <div className="text-sm text-muted-foreground">{item.reason}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">{item.readiness}%</div>
                          <div className="text-xs text-muted-foreground">Readiness</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
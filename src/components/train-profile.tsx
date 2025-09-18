import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  ArrowLeft,
  Gauge,
  Fuel,
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  MapPin,
  Clock,
  User,
  FileText,
  Bot,
  Zap,
  Award,
  Map
} from 'lucide-react';
import { mockTrains, mockCertificates, mockJobCards, mockPredictiveAlerts, mockDecisionLogs, mockMapLocations } from '../data/mock-data';
import { TrainStatus } from '../types/train';
import { MapComponent } from './map-component';

interface TrainProfileProps {
  trainId: string;
  onBack: () => void;
}

export function TrainProfile({ trainId, onBack }: TrainProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const train = mockTrains.find(t => t.id === trainId);
  const certificates = mockCertificates.filter(c => c.trainId === trainId);
  const jobCards = mockJobCards.filter(jc => jc.trainId === trainId);
  const alerts = mockPredictiveAlerts.filter(a => a.trainId === trainId);
  const decisionHistory = mockDecisionLogs.filter(dl => dl.trainId === trainId);

  if (!train) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1>Train Not Found</h1>
            <p className="text-muted-foreground">Train {trainId} could not be found</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: TrainStatus) => {
    switch (status) {
      case 'go_for_service': return 'text-green-600 bg-green-50 border-green-200';
      case 'standby': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'inspection_required': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getStatusText = (status: TrainStatus) => {
    switch (status) {
      case 'go_for_service': return 'Go for Service';
      case 'standby': return 'Standby';
      case 'inspection_required': return 'Inspection Required';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1>{train.name}</h1>
          <p className="text-muted-foreground">Train ID: {train.id}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance & Certificates</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
          <TabsTrigger value="analytics">AI & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Badge className={`mb-2 ${getStatusColor(train.status)}`}>
                    {getStatusText(train.status)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{train.currentLocation}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Location</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span>{train.totalMileage.toLocaleString()} km</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Mileage</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <span className={train.aiRiskScore > 0.5 ? 'text-red-600' : 'text-green-600'}>
                      {Math.round(train.aiRiskScore * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">AI Risk Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Brake Wear</span>
                    <span>{train.brakeWearPercentage}%</span>
                  </div>
                  <Progress value={train.brakeWearPercentage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Energy Efficiency</span>
                    <span>{train.energyEfficiencyScore}%</span>
                  </div>
                  <Progress value={train.energyEfficiencyScore} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    <span>HVAC Status</span>
                  </div>
                  <Badge variant={train.hvacStatus === 'normal' ? 'default' : 'secondary'}>
                    {train.hvacStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <span>Next Maintenance</span>
                  </div>
                  <span className="font-mono">{train.nextMaintenanceDue} runs</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Next Certificate Expiry</span>
                  </div>
                  <span className={`font-mono ${train.nextCertificateExpiry <= 7 ? 'text-red-600' : ''}`}>
                    {train.nextCertificateExpiry} days
                  </span>
                </div>
                
                {train.lastScanTime && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Last Scanned</span>
                    </div>
                    <span className="text-sm">
                      {train.lastScanTime.toLocaleString()} at {train.lastScanTerminal}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Train Location Map
              </CardTitle>
              <CardDescription>
                Current position of {train.name} and nearby infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <MapComponent
                  locations={mockMapLocations.filter(loc => loc.id === trainId || loc.type !== 'train')}
                  center={mockMapLocations.find(loc => loc.id === trainId)?.lat ? 
                    [mockMapLocations.find(loc => loc.id === trainId)!.lat, mockMapLocations.find(loc => loc.id === trainId)!.lng] : 
                    [9.9312, 76.2673]
                  }
                  zoom={13}
                  height="400px"
                  showControls={true}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{train.currentLocation}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Current Location</p>
                </div>
                
                {train.assignedBay && (
                  <div className="text-center p-4 border rounded-lg">
                    <span>{train.assignedBay}</span>
                    <p className="text-sm text-muted-foreground">Assigned Bay</p>
                  </div>
                )}
                
                {train.assignedRoute && (
                  <div className="text-center p-4 border rounded-lg">
                    <span>{train.assignedRoute}</span>
                    <p className="text-sm text-muted-foreground">Assigned Route</p>
                  </div>
                )}
                
                {train.lastScanTerminal && (
                  <div className="text-center p-4 border rounded-lg">
                    <span>{train.lastScanTerminal}</span>
                    <p className="text-sm text-muted-foreground">Last Scan Terminal</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operational Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 border rounded-lg">
                  <Badge className={`mb-2 ${getStatusColor(train.status)}`}>
                    {getStatusText(train.status)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Energy Efficiency</span>
                    <span>{train.energyEfficiencyScore}%</span>
                  </div>
                  <Progress value={train.energyEfficiencyScore} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    <span>HVAC Status</span>
                  </div>
                  <Badge variant={train.hvacStatus === 'normal' ? 'default' : 'secondary'}>
                    {train.hvacStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>
                  Usage and time-based certificate validity status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certificates.length > 0 ? certificates.map((cert) => (
                    <div key={cert.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4>{cert.type}</h4>
                        <Badge variant={cert.status === 'valid' ? 'default' : 'destructive'}>
                          {cert.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Issued: {cert.issuedDate.toLocaleDateString()}
                      </p>
                      {cert.expiryDate && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Expires: {cert.expiryDate.toLocaleDateString()}
                        </p>
                      )}
                      {cert.usageLimit && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Usage</span>
                            <span>{cert.currentUsage.toLocaleString()}/{cert.usageLimit.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={(cert.currentUsage / cert.usageLimit) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center py-4">
                      No certificates found for this train
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Cards</CardTitle>
                <CardDescription>
                  Open and closed maintenance job cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobCards.length > 0 ? jobCards.map((jobCard) => (
                    <div key={jobCard.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4>{jobCard.title}</h4>
                        <Badge variant={getPriorityColor(jobCard.priority)}>
                          {jobCard.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {jobCard.description}
                      </p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Status: {jobCard.status.replace('_', ' ')}</span>
                        <span>Created: {jobCard.createdDate.toLocaleDateString()}</span>
                      </div>
                      {jobCard.assignedTo && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Assigned to: {jobCard.assignedTo}
                        </p>
                      )}
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center py-4">
                      No job cards found for this train
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Decision History</CardTitle>
              <CardDescription>
                Immutable log of every run, decision, and supervisor action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Terminal</TableHead>
                      <TableHead>Run ID</TableHead>
                      <TableHead>Decision</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Override</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {decisionHistory.length > 0 ? decisionHistory.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {log.timestamp.toLocaleString()}
                        </TableCell>
                        <TableCell>{log.terminal}</TableCell>
                        <TableCell className="font-mono">{log.runId}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(log.decision)}>
                            {getStatusText(log.decision)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.supervisorName}
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.wasOverridden ? (
                            <Badge variant="destructive">Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={log.reason}>
                          {log.reason}
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                          No decision history found for this train
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Risk Score Trend</CardTitle>
                <CardDescription>
                  Historical AI risk assessment over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">Risk trend chart coming soon</p>
                    <p className="text-sm text-gray-400">
                      Current risk score: {Math.round(train.aiRiskScore * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Alerts</CardTitle>
                <CardDescription>
                  AI-generated maintenance predictions and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.length > 0 ? alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 border rounded-lg ${getAlertColor(alert.alertLevel)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4>{alert.component}</h4>
                        <Badge variant={alert.alertLevel === 'critical' || alert.alertLevel === 'high' ? 'destructive' : 'default'}>
                          {alert.alertLevel}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{alert.message}</p>
                      <div className="flex justify-between text-sm">
                        <span>Confidence: {Math.round(alert.confidence * 100)}%</span>
                        <span>Predicted: {alert.predictedFailureDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center py-4">
                      No active predictive alerts for this train
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
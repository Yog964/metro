import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { 
  Calendar as CalendarIcon,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Target,
  Wrench,
  Sparkles,
  Database,
  Activity,
  DollarSign,
  MapPin,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { 
  mockTrains, 
  mockExtendedCertificates, 
  mockJobCardClosures,
  mockBrandingCommitments,
  mockCampaignLogs,
  mockCleaningQueue,
  mockWorkers,
  mockMaintenanceTriage,
  mockPredictiveAlerts
} from '../data/mock-data';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

export function WorkshopManagerDashboard({ onPageChange }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [certificateFilter, setCertificateFilter] = useState<string>('all');

  const currentDateTime = new Date();
  const certificatesAtRisk = mockExtendedCertificates.filter(cert => cert.status === 'expiring_soon').length;
  const pendingClosures = mockJobCardClosures.filter(jc => jc.status === 'pending_closure').length;
  const fleetComplianceRate = Math.round(((mockTrains.length - certificatesAtRisk) / mockTrains.length) * 100);

  const filteredCertificates = certificateFilter === 'all' 
    ? mockExtendedCertificates.filter(cert => cert.status === 'expiring_soon')
    : mockExtendedCertificates.filter(cert => cert.status === 'expiring_soon' && cert.type.includes(certificateFilter));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Workshop Manager Dashboard</h1>
          <p className="text-muted-foreground">
            {currentDateTime.toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              timeZone: 'Asia/Kolkata'
            })}, {currentDateTime.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Asia/Kolkata'
            })} IST
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Workshop Manager
        </Badge>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Certificates At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-red-600">{certificatesAtRisk}</div>
            <p className="text-xs text-muted-foreground">
              Expiring within 7 days or 10 runs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Compliance Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{fleetComplianceRate}%</div>
            <Progress value={fleetComplianceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Job-Card Closures</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-amber-600">{pendingClosures}</div>
            <p className="text-xs text-muted-foreground">
              Completed tasks requiring sign-off
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificate Renewals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Priority Action List - Certificate Renewals</CardTitle>
              <Select value={certificateFilter} onValueChange={setCertificateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Brake">Brake Systems</SelectItem>
                  <SelectItem value="HVAC">HVAC Systems</SelectItem>
                  <SelectItem value="Telecom">Telecom Systems</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCertificates.map((cert) => (
                <div key={cert.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cert.trainId}</span>
                    <Badge variant={cert.documentsUploaded ? 'default' : 'secondary'}>
                      {cert.documentsUploaded ? 'Documents Uploaded' : 'Renewal Pending'}
                    </Badge>
                  </div>
                  <p className="text-sm">{cert.type}</p>
                  <p className="text-sm text-muted-foreground">{cert.expiryCondition}</p>
                  <div className="flex justify-end mt-2">
                    <Button size="sm" variant={cert.documentsUploaded ? 'outline' : 'default'}>
                      <Upload className="h-4 w-4 mr-2" />
                      {cert.documentsUploaded ? 'Update Certificate' : 'Upload New Certificate'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Job-Card Clearance Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Job-Card Clearance Queue</CardTitle>
            <CardDescription>
              Maintenance physically complete, requires system closure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockJobCardClosures.map((closure) => (
                <div key={closure.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{closure.trainId}</span>
                      <Badge variant="outline">{closure.jobCardNumber}</Badge>
                    </div>
                    <Badge variant={closure.status === 'pending_closure' ? 'destructive' : 'default'}>
                      {closure.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{closure.workSummary}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Completed by {closure.completedBy} • {closure.maximoReference}
                  </p>
                  <div className="flex justify-end">
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify & Close
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Certificate Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Certificate Calendar</CardTitle>
          <CardDescription>
            Visual overview of certificate expiry dates across the fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">This Week's Expiries</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>TRN-002 - Brake Oil</span>
                      <span className="text-red-600">2 runs left</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>TRN-004 - HVAC Fitness</span>
                      <span className="text-red-600">3 days</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Next Week's Expiries</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>TRN-003 - Telecom Systems</span>
                      <span className="text-amber-600">450 km</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function BrandingManagerDashboard({ onPageChange }: DashboardProps) {
  const activeCampaigns = mockBrandingCommitments.filter(bc => 
    new Date() >= bc.startDate && new Date() <= bc.endDate
  );
  
  const overallCompliance = Math.round(
    activeCampaigns.reduce((acc, campaign) => 
      acc + (campaign.currentExposure / campaign.exposureTarget) * 100, 0
    ) / activeCampaigns.length
  );

  const revenueAtRisk = activeCampaigns
    .filter(campaign => campaign.status === 'behind')
    .reduce((acc, campaign) => acc + (campaign.exposureTarget - campaign.currentExposure) * 15, 0); // Estimated $15 per exposure unit

  const todayExposure = activeCampaigns.reduce((acc, campaign) => acc + Math.floor(campaign.currentExposure * 0.1), 0); // Approximate daily exposure

  return (
    <div className="space-y-6">
      <div>
        <h1>Branding Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive view of advertising campaign performance and compliance
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Live Campaign Compliance</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{overallCompliance}%</div>
            <Progress value={overallCompliance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Revenue At Risk</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-red-600">₹{revenueAtRisk.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">
              From under-exposed campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Exposure Today</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{todayExposure}</div>
            <p className="text-xs text-muted-foreground">
              Run hours/km for all branded trains
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Campaign Monitor */}
        <Card>
          <CardHeader>
            <CardTitle>Real-time Campaign Monitor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium">{campaign.trainId}</span>
                      <p className="text-sm text-muted-foreground">{campaign.advertiser}</p>
                    </div>
                    <Badge variant={
                      campaign.status === 'on_track' ? 'default' :
                      campaign.status === 'ahead' ? 'secondary' : 'destructive'
                    }>
                      {campaign.status === 'on_track' ? 'On Track' :
                       campaign.status === 'ahead' ? 'Ahead' : 'Behind Schedule'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target: {campaign.exposureTarget}</span>
                      <span>Actual: {campaign.currentExposure}</span>
                    </div>
                    <Progress 
                      value={(campaign.currentExposure / campaign.exposureTarget) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {Math.round((campaign.currentExposure / campaign.exposureTarget) * 100)}% Complete
                      </span>
                      <span>
                        {campaign.exposureTarget - campaign.currentExposure} remaining
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conflict & Opportunity Log */}
        <Card>
          <CardHeader>
            <CardTitle>Conflict & Opportunity Log</CardTitle>
            <CardDescription>
              Real-time feed explaining branding commitment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCampaignLogs.map((log) => (
                <div key={log.id} className="border-l-4 border-l-blue-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={
                      log.type === 'conflict' ? 'destructive' :
                      log.type === 'opportunity' ? 'secondary' : 'default'
                    }>
                      {log.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{log.logEntry}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {log.trainId} - {log.campaignName}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CleaningManagerDashboard({ onPageChange }: DashboardProps) {
  const trainsAwaitingCleaning = mockCleaningQueue.filter(item => 
    item.status === 'ready_for_cleaning' || item.status === 'pending_inspection'
  ).length;

  const averageTurnaroundTime = 2.5; // hours
  
  const availableWorkers = mockWorkers.filter(w => w.type === 'cleaning' && w.status === 'available').length;
  const assignedWorkers = mockWorkers.filter(w => w.type === 'cleaning' && w.status === 'assigned').length;
  const breakWorkers = mockWorkers.filter(w => w.type === 'cleaning' && w.status === 'on_break').length;

  const [draggedWorker, setDraggedWorker] = useState<string | null>(null);

  const handleDragStart = (workerId: string) => {
    setDraggedWorker(workerId);
  };

  const handleDrop = (trainId: string) => {
    if (draggedWorker) {
      // In real implementation, this would update the backend
      console.log(`Assigned worker ${draggedWorker} to train ${trainId}`);
      setDraggedWorker(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Cleaning Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Operational command center for managing cleaning workforce and train readiness
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Trains Awaiting Cleaning</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-amber-600">{trainsAwaitingCleaning}</div>
            <p className="text-xs text-muted-foreground">
              Live count in queue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average Turnaround Time</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{averageTurnaroundTime}h</div>
            <p className="text-xs text-muted-foreground">
              From arrival to completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Worker Status</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xl text-green-600">{availableWorkers}</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
              <div className="text-center">
                <div className="text-xl text-blue-600">{assignedWorkers}</div>
                <div className="text-xs text-muted-foreground">Assigned</div>
              </div>
              <div className="text-center">
                <div className="text-xl text-amber-600">{breakWorkers}</div>
                <div className="text-xs text-muted-foreground">On Break</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Cleaning Workflow */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Cleaning Workflow</CardTitle>
            <CardDescription>
              Drag and drop workers to assign cleaning tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {/* Workflow Columns */}
              <div className="space-y-2">
                <h4 className="font-medium text-center p-2 bg-gray-100 rounded">Pending Inspection</h4>
                <div className="space-y-2 min-h-[200px]">
                  {mockCleaningQueue
                    .filter(item => item.status === 'pending_inspection')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onDrop={() => handleDrop(item.trainId)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <div className="font-medium">{item.trainId}</div>
                        <div className="text-xs text-muted-foreground">
                          Arrived: {item.arrivalTime.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-center p-2 bg-blue-100 rounded">Ready for Cleaning</h4>
                <div className="space-y-2 min-h-[200px]">
                  {mockCleaningQueue
                    .filter(item => item.status === 'ready_for_cleaning')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onDrop={() => handleDrop(item.trainId)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <div className="font-medium">{item.trainId}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.bay || 'Awaiting bay assignment'}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-center p-2 bg-amber-100 rounded">In Progress</h4>
                <div className="space-y-2 min-h-[200px]">
                  {mockCleaningQueue
                    .filter(item => item.status === 'cleaning_in_progress')
                    .map((item) => (
                      <div key={item.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{item.trainId}</div>
                        <div className="text-xs text-muted-foreground">
                          Worker: {item.assignedWorker}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ETA: {item.estimatedCompletion?.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-center p-2 bg-green-100 rounded">Completed</h4>
                <div className="space-y-2 min-h-[200px]">
                  {mockCleaningQueue
                    .filter(item => item.status === 'completed')
                    .map((item) => (
                      <div key={item.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{item.trainId}</div>
                        <div className="text-xs text-green-600">Ready for Service</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Worker Roster */}
        <Card>
          <CardHeader>
            <CardTitle>Worker Roster & Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWorkers
                .filter(worker => worker.type === 'cleaning')
                .map((worker) => (
                  <div
                    key={worker.id}
                    draggable={worker.status === 'available'}
                    onDragStart={() => handleDragStart(worker.id)}
                    className={`p-3 border rounded-lg ${
                      worker.status === 'available' 
                        ? 'cursor-move hover:bg-blue-50 border-blue-200' 
                        : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{worker.name}</span>
                      </div>
                      <Badge variant={
                        worker.status === 'available' ? 'secondary' :
                        worker.status === 'assigned' ? 'default' : 'outline'
                      }>
                        {worker.status}
                      </Badge>
                    </div>
                    {worker.currentTask && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {worker.currentTask}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Shift ends: {worker.shiftEndTime.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SystemAdminDashboard({ onPageChange }: DashboardProps) {
  const modelAccuracy = 91.2;
  const dataIntegrationStatus = {
    maximo: 'connected',
    tcms: 'connected',
    iot: 'warning'
  };
  const systemLatency = 2.3; // seconds

  const averageAIRisk = mockTrains.reduce((acc, train) => acc + (train.aiRiskScore || 0), 0) / mockTrains.length;

  return (
    <div className="space-y-6">
      <div>
        <h1>System Admin / AI Engineer Dashboard</h1>
        <p className="text-muted-foreground">
          High-level technical dashboard monitoring entire system performance
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">AI Model Accuracy</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{modelAccuracy}%</div>
            <p className="text-xs text-muted-foreground">
              7-day predictive model performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Data Integration Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Maximo</span>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">TCMS</span>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">IoT Sensors</span>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">System Latency</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{systemLatency}s</div>
            <p className="text-xs text-muted-foreground">
              Average scan to decision time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Performance & Predictive Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>AI Performance & Predictive Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Fleet Average AI Risk Score</span>
                  <span className="text-sm">{(averageAIRisk * 100).toFixed(1)}%</span>
                </div>
                <Progress value={averageAIRisk * 100} />
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Critical Predictive Alerts</h4>
                {mockPredictiveAlerts
                  .filter(alert => alert.alertLevel === 'high')
                  .map((alert) => (
                    <div key={alert.id} className="border-l-4 border-l-red-500 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive">Alert {alert.id.split('-')[1]}</Badge>
                        <span className="text-sm">{alert.trainId}</span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        Confidence: {Math.round(alert.confidence * 100)}%
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ML Feedback Loop Monitor */}
        <Card>
          <CardHeader>
            <CardTitle>ML Feedback Loop Monitor</CardTitle>
            <CardDescription>
              Model retraining and learning process health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl">152</div>
                  <div className="text-sm text-muted-foreground">New Run Outcomes Recorded</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl">04:00</div>
                  <div className="text-sm text-muted-foreground">Last Model Retraining</div>
                  <div className="text-xs text-muted-foreground">18 Sep 2025</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Training Pipeline Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Data Collection</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Model Training</span>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Validation</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    System is learning from historical outcomes
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function MaintenanceManagerDashboard({ onPageChange }: DashboardProps) {
  const unfitTrains = mockMaintenanceTriage.filter(mt => mt.status === 'pending_diagnosis').length;
  const highPriorityJobs = mockMaintenanceTriage.filter(mt => 
    ['high', 'critical'].includes(mt.priority) && mt.status !== 'completed'
  ).length;
  const averageRepairTime = 4.8; // hours

  const technicianWorkload = mockWorkers
    .filter(worker => worker.type === 'maintenance')
    .map(worker => ({
      name: worker.name,
      openJobs: mockMaintenanceTriage.filter(mt => mt.assignedTechnician === worker.name).length,
      status: worker.status
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1>Maintenance Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Command center for diagnosing issues and dispatching technicians
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Unfit Trains Awaiting Diagnosis</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-red-600">{unfitTrains}</div>
            <p className="text-xs text-muted-foreground">
              In Inspection Bay Line
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Open High-Priority Jobs</CardTitle>
            <Wrench className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-amber-600">{highPriorityJobs}</div>
            <p className="text-xs text-muted-foreground">
              Urgent tasks assigned to technicians
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average Repair Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{averageRepairTime}h</div>
            <p className="text-xs text-muted-foreground">
              Per job completion time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Triage & Assignment Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Triage & Assignment Queue</CardTitle>
            <CardDescription>
              Trains flagged for maintenance by AI or supervisors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMaintenanceTriage.map((triage) => (
                <div key={triage.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{triage.trainId}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        triage.priority === 'critical' ? 'destructive' :
                        triage.priority === 'high' ? 'default' :
                        triage.priority === 'medium' ? 'secondary' : 'outline'
                      }>
                        {triage.priority}
                      </Badge>
                      <Badge variant="outline">
                        {triage.flaggedBy}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-2">{triage.flaggedFor}</p>
                  
                  {triage.diagnosisNotes && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Diagnosis: {triage.diagnosisNotes}
                    </p>
                  )}

                  {triage.assignedTechnician && (
                    <p className="text-xs text-blue-600 mb-2">
                      Assigned to: {triage.assignedTechnician}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <Badge variant={
                      triage.status === 'pending_diagnosis' ? 'destructive' :
                      triage.status === 'diagnosed' ? 'secondary' :
                      triage.status === 'assigned' ? 'default' : 'outline'
                    }>
                      {triage.status.replace('_', ' ')}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Analyser Report
                      </Button>
                      {triage.status === 'diagnosed' && (
                        <Button size="sm">
                          Assign Technician
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technician Workload & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Technician Workload & Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technicianWorkload.map((tech, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{tech.name}</span>
                    <Badge variant={
                      tech.status === 'available' ? 'secondary' :
                      tech.status === 'assigned' ? 'default' : 'outline'
                    }>
                      {tech.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Open Jobs:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(tech.openJobs * 20, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{tech.openJobs}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <Button className="w-full" size="sm">
                  Create New Work Order
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  View All Technicians
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Generate Workload Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
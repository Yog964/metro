import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  QrCode, 
  Wrench, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Zap,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Train
} from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { mockTrains, mockJobCards, mockPredictiveAlerts, mockCertificates, mockBrandingCommitments } from '../data/mock-data';
import { 
  WorkshopManagerDashboard, 
  BrandingManagerDashboard, 
  CleaningManagerDashboard, 
  SystemAdminDashboard, 
  MaintenanceManagerDashboard 
} from './role-dashboards';
import { MobileWorkerInterface } from './mobile-worker-interface';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

export function Dashboard({ onPageChange }: DashboardProps) {
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'go_for_service': return 'text-green-600 bg-green-50';
      case 'standby': return 'text-yellow-600 bg-yellow-50';
      case 'inspection_required': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'go_for_service': return 'Go for Service';
      case 'standby': return 'Standby';
      case 'inspection_required': return 'Inspection Required';
      default: return status;
    }
  };

  // Operations Supervisor Dashboard
  if (user?.role === 'operations_supervisor') {
    const terminalTrains = mockTrains.filter(train => 
      train.currentLocation.includes(user.terminal || 'Terminal A')
    );
    const pendingDecisions = terminalTrains.filter(train => 
      train.status === 'standby' || !train.lastScanTime
    );

    return (
      <div className="space-y-6">
        <div>
          <h1>Operations Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name} - {user.terminal}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <QrCode className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Trains at Terminal</p>
                  <p className="text-2xl">{terminalTrains.length}</p>
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
                  <p className="text-sm text-muted-foreground">Pending Decisions</p>
                  <p className="text-2xl">{pendingDecisions.length}</p>
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
                  <p className="text-sm text-muted-foreground">Ready for Service</p>
                  <p className="text-2xl">
                    {terminalTrains.filter(t => t.status === 'go_for_service').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Need Inspection</p>
                  <p className="text-2xl">
                    {terminalTrains.filter(t => t.status === 'inspection_required').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full h-16 text-lg"
                onClick={() => onPageChange('scan')}
              >
                <QrCode className="mr-2 h-6 w-6" />
                Scan Train
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onPageChange('fleet')}
              >
                View Fleet Status
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trains at {user.terminal}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {terminalTrains.map((train) => (
                  <div key={train.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p>{train.name}</p>
                      <p className="text-sm text-muted-foreground">{train.currentLocation}</p>
                    </div>
                    <Badge className={getStatusColor(train.status)}>
                      {getStatusText(train.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Role-based dashboards
  if (user?.role === 'workshop_manager') {
    return <WorkshopManagerDashboard onPageChange={onPageChange} />;
  }

  if (user?.role === 'branding_manager') {
    return <BrandingManagerDashboard onPageChange={onPageChange} />;
  }

  if (user?.role === 'cleaning_manager') {
    return <CleaningManagerDashboard onPageChange={onPageChange} />;
  }

  if (user?.role === 'system_admin') {
    return <SystemAdminDashboard onPageChange={onPageChange} />;
  }

  if (user?.role === 'maintenance_manager') {
    return <MaintenanceManagerDashboard onPageChange={onPageChange} />;
  }

  // Mobile Worker Interfaces
  if (user?.role === 'worker_technician' || user?.role === 'worker_cleaning') {
    return <MobileWorkerInterface onPageChange={onPageChange} />;
  }

  // Default dashboard for other roles
  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name} - {user?.role.replace('_', ' ')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Train className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Total Fleet</p>
                <p className="text-2xl">{mockTrains.length}</p>
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
                <p className="text-sm text-muted-foreground">Operational</p>
                <p className="text-2xl">
                  {mockTrains.filter(t => t.status === 'go_for_service').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Alerts</p>
                <p className="text-2xl">{mockPredictiveAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                <p className="text-2xl">84%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => onPageChange('fleet')}>
              <Train className="mr-2 h-4 w-4" />
              View Fleet
            </Button>
            <Button onClick={() => onPageChange('maintenance')}>
              <Wrench className="mr-2 h-4 w-4" />
              Maintenance Hub
            </Button>
            <Button onClick={() => onPageChange('depot')}>
              <Zap className="mr-2 h-4 w-4" />
              Depot Optimization
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
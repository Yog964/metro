import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { Login } from './components/login';
import { Navigation, PageType } from './components/navigation';
import { Dashboard } from './components/dashboard';
import { ScanWorkflow } from './components/scan-workflow';
import { FleetStatus } from './components/fleet-status';
import { TrainProfile } from './components/train-profile';
import { MaintenanceHub } from './components/maintenance-hub';
import { DepotOptimization } from './components/depot-optimization';
import { DepotSimulation } from './components/depot-simulation';
import { WorkerTaskList } from './components/worker-task-list';
import { Administration } from './components/administration';
import { Toaster } from './components/ui/sonner';
import { MobileMeta } from './components/mobile-meta';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [selectedTrainId, setSelectedTrainId] = useState<string | undefined>();

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleTrainSelect = (trainId: string) => {
    setSelectedTrainId(trainId);
    setCurrentPage('train-profile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={handlePageChange} />;
      case 'scan':
        return <ScanWorkflow onTrainSelect={handleTrainSelect} />;
      case 'fleet':
        return <FleetStatus onTrainSelect={handleTrainSelect} />;
      case 'train-profile':
        return selectedTrainId ? (
          <TrainProfile 
            trainId={selectedTrainId} 
            onBack={() => setCurrentPage('fleet')} 
          />
        ) : (
          <div className="p-6">
            <h1>Train Profile</h1>
            <p className="text-muted-foreground">No train selected</p>
          </div>
        );
      case 'maintenance':
        return <MaintenanceHub />;
      case 'depot':
        return <DepotOptimization />;
      case 'simulation':
        return <DepotSimulation />;
      case 'worker-tasks':
        return <WorkerTaskList />;
      case 'admin':
        return <Administration />;
      default:
        return <Dashboard onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        selectedTrainId={selectedTrainId}
      />
      
      {/* Main content with proper spacing for fixed navigation */}
      <div className="md:ml-64">
        <main className="p-4 md:p-6 pt-4 pb-20 md:pt-6 md:pb-6">
          {renderPage()}
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MobileMeta />
      <AppContent />
    </AuthProvider>
  );
}
import React from 'react';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  QrCode, 
  Train, 
  Wrench, 
  Zap, 
  Settings, 
  Menu, 
  LogOut, 
  User, 
  FileText,
  BarChart3,
  ClipboardCheck
} from 'lucide-react';
import { useAuth, UserRole } from '../contexts/auth-context';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';

export type PageType = 
  | 'dashboard' 
  | 'scan' 
  | 'fleet' 
  | 'train-profile' 
  | 'maintenance' 
  | 'depot' 
  | 'simulation'
  | 'worker-tasks'
  | 'admin';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  selectedTrainId?: string;
}

const navigationItems = [
  { id: 'dashboard' as PageType, label: 'Dashboard', icon: LayoutDashboard, roles: ['platform_supervisor', 'operations_supervisor', 'workshop_manager', 'maintenance_manager', 'worker_technician', 'cleaning_manager', 'worker_cleaning', 'depot_manager', 'rolling_stock_engineer', 'branding_manager', 'system_admin'] },
  { id: 'scan' as PageType, label: 'AI Scanner', icon: QrCode, roles: ['platform_supervisor', 'operations_supervisor'] },
  { id: 'fleet' as PageType, label: 'Fleet Status', icon: Train, roles: ['operations_supervisor', 'depot_manager', 'rolling_stock_engineer', 'system_admin'] },
  { id: 'maintenance' as PageType, label: 'Maintenance Hub', icon: Wrench, roles: ['workshop_manager', 'maintenance_manager', 'rolling_stock_engineer', 'system_admin'] },
  { id: 'depot' as PageType, label: 'Depot Optimization', icon: Zap, roles: ['depot_manager', 'system_admin'] },
  { id: 'simulation' as PageType, label: 'Fleet Simulation', icon: BarChart3, roles: ['depot_manager', 'system_admin'] },
  { id: 'worker-tasks' as PageType, label: 'My Tasks', icon: ClipboardCheck, roles: ['worker_technician', 'worker_cleaning'] },
  { id: 'admin' as PageType, label: 'Administration', icon: Settings, roles: ['system_admin'] }
];

export function Navigation({ currentPage, onPageChange, selectedTrainId }: NavigationProps) {
  const { user, logout } = useAuth();

  const getVisibleItems = () => {
    if (!user) return [];
    
    return navigationItems.filter(item => 
      item.roles.includes('all') || item.roles.includes(user.role)
    );
  };

  const NavItems = () => (
    <>
      {getVisibleItems().map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onPageChange(item.id)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
      
      {selectedTrainId && (
        <Button
          variant={currentPage === 'train-profile' ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onPageChange('train-profile')}
        >
          <FileText className="mr-2 h-4 w-4" />
          Train Profile
        </Button>
      )}
      
      <div className="mt-auto pt-4 border-t">
        <div className="px-3 py-2 text-sm text-muted-foreground">
          <div>{user?.name}</div>
          <div className="capitalize">{user?.role.replace('_', ' ')}</div>
          {user?.terminal && <div>{user.terminal}</div>}
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex h-screen w-64 bg-white border-r flex-col p-4 fixed left-0 top-0 z-40">
        <div className="mb-8">
          <h2 className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              
              <img src="https://github.com/user-attachments/assets/cbddd39a-b338-49de-8229-bb4cf9125e46" alt="" />
            </div>
            AnushaSon
          </h2>
        </div>
        
        <div className="flex-1 flex flex-col space-y-2 overflow-y-auto">
          <NavItems />
        </div>
      </div>

      {/* Mobile Top Bar with Menu */}
      <div className="md:hidden bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between p-3 min-h-[56px]">
          {/* Menu button in top left - Android standard touch target */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="p-3 min-h-[48px] min-w-[48px] touch-manipulation">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 border-0">
              <SheetHeader className="p-4 border-b bg-slate-50">
                <SheetTitle className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Train className="w-4 h-4 text-white" />
                  </div>
                  Fleet Management
                </SheetTitle>
                <SheetDescription className="text-left text-sm">
                  Navigate through different sections of the fleet management system
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col p-4 space-y-1 overflow-y-auto">
                  {getVisibleItems().map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start min-h-[48px] touch-manipulation text-left"
                        onClick={() => onPageChange(item.id)}
                      >
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Button>
                    );
                  })}
                  
                  {selectedTrainId && (
                    <Button
                      variant={currentPage === 'train-profile' ? "default" : "ghost"}
                      className="w-full justify-start min-h-[48px] touch-manipulation"
                      onClick={() => onPageChange('train-profile')}
                    >
                      <FileText className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">Train Profile</span>
                    </Button>
                  )}
                </div>
                
                {/* User section at bottom */}
                <div className="border-t bg-slate-50 p-4">
                  <div className="mb-3 text-sm">
                    <div className="font-medium text-gray-900">{user?.name}</div>
                    <div className="text-gray-600 capitalize text-xs">
                      {user?.role.replace('_', ' ')}
                    </div>
                    {user?.terminal && (
                      <div className="text-gray-500 text-xs">{user.terminal}</div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start min-h-[48px] touch-manipulation text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={logout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* App title in center */}
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-medium text-gray-900 truncate max-w-[200px]">
            {getVisibleItems().find(item => item.id === currentPage)?.label || 'Fleet Management'}
          </h1>
          
          {/* User info in top right */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-right text-sm min-w-0">
              <div className="font-medium text-gray-900 truncate text-xs leading-tight">
                {user?.name}
              </div>
              <div className="text-xs text-gray-600 capitalize truncate leading-tight">
                {user?.role.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
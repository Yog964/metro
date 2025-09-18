import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 
  | 'platform_supervisor'
  | 'operations_supervisor' 
  | 'workshop_manager'
  | 'maintenance_manager'
  | 'worker_technician'
  | 'cleaning_manager'
  | 'worker_cleaning'
  | 'depot_manager'
  | 'rolling_stock_engineer'
  | 'branding_manager'
  | 'system_admin';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  terminal?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  'ops1': {
    id: '1',
    username: 'ops1',
    name: 'Sarah Johnson',
    role: 'operations_supervisor',
    terminal: 'Terminal A'
  },
  'workshop1': {
    id: '2',
    username: 'workshop1',
    name: 'Mike Chen',
    role: 'workshop_manager'
  },
  'depot1': {
    id: '3',
    username: 'depot1',
    name: 'Lisa Rodriguez',
    role: 'depot_manager'
  },
  'engineer1': {
    id: '4',
    username: 'engineer1',
    name: 'David Kumar',
    role: 'rolling_stock_engineer'
  },
  'brand1': {
    id: '5',
    username: 'brand1',
    name: 'Emma Thompson',
    role: 'branding_manager'
  },
  'admin1': {
    id: '6',
    username: 'admin1',
    name: 'Alex Wang',
    role: 'system_admin'
  },
  'maintenance1': {
    id: '7',
    username: 'maintenance1',
    name: 'Rajesh Patel',
    role: 'maintenance_manager'
  },
  'cleaning1': {
    id: '8',
    username: 'cleaning1',
    name: 'Priya Sharma',
    role: 'cleaning_manager'
  },
  'tech1': {
    id: '9',
    username: 'tech1',
    name: 'John Smith',
    role: 'worker_technician'
  },
  'cleaner1': {
    id: '10',
    username: 'cleaner1',
    name: 'Maria Garcia',
    role: 'worker_cleaning'
  },
  'platform1': {
    id: '11',
    username: 'platform1',
    name: 'Arun Kumar',
    role: 'platform_supervisor'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('train_fleet_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('train_fleet_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers[username];
    
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      localStorage.setItem('train_fleet_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('train_fleet_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
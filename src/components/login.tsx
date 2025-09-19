import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Loader2, 
  Train 
} from 'lucide-react';
import { useAuth } from '../contexts/auth-context';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  const mockUsers = [
    { username: 'platform1', role: 'platform_supervisor', name: 'Arun Kumar' },
    { username: 'ops1', role: 'operations_supervisor', name: 'Sarah Johnson' },
    { username: 'workshop1', role: 'workshop_manager', name: 'Mike Chen' },
    { username: 'maintenance1', role: 'maintenance_manager', name: 'Rajesh Patel' },
    { username: 'tech1', role: 'worker_technician', name: 'John Smith' },
    { username: 'cleaning1', role: 'cleaning_manager', name: 'Priya Sharma' },
    { username: 'cleaner1', role: 'worker_cleaning', name: 'Maria Garcia' },
    { username: 'depot1', role: 'depot_manager', name: 'Lisa Rodriguez' },
    { username: 'engineer1', role: 'rolling_stock_engineer', name: 'David Kumar' },
    { username: 'brand1', role: 'branding_manager', name: 'Emma Thompson' },
    { username: 'admin1', role: 'system_admin', name: 'Alex Wang' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Train className="w-6 h-6 text-white" />
          </div>
          <h1>Anushason</h1>
          <p className="text-muted-foreground">Secure access to fleet operations</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demo Credentials</CardTitle>
            <CardDescription>
              Use any of these credentials (password: demo123)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockUsers.map((cred) => (
                <div key={cred.username} className="flex items-center justify-between text-sm">
                  <span className="font-mono">{cred.username}</span>
                  <span className="text-muted-foreground">
                    {cred.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

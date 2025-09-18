import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  MapPin, 
  Search, 
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  Wrench,
  Map
} from 'lucide-react';
import { mockTrains, mockMapLocations, getTrainLocations, getInfrastructureLocations } from '../data/mock-data';
import { Train, TrainStatus } from '../types/train';
import { MapComponent, MapLocation } from './map-component';

interface FleetStatusProps {
  onTrainSelect: (trainId: string) => void;
}

export function FleetStatus({ onTrainSelect }: FleetStatusProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('id');
  const [activeTab, setActiveTab] = useState('list');

  const handleLocationClick = (location: MapLocation) => {
    if (location.type === 'train') {
      onTrainSelect(location.id);
    }
  };

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

  const getRiskColor = (score: number) => {
    if (score < 0.3) return 'text-green-600';
    if (score < 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredTrains = mockTrains.filter(train => {
    const matchesSearch = train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         train.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || train.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || train.currentLocation.includes(locationFilter);
    
    return matchesSearch && matchesStatus && matchesLocation;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'id': return a.id.localeCompare(b.id);
      case 'status': return a.status.localeCompare(b.status);
      case 'risk': return b.aiRiskScore - a.aiRiskScore;
      case 'mileage': return b.totalMileage - a.totalMileage;
      default: return 0;
    }
  });

  const statusCounts = {
    total: mockTrains.length,
    operational: mockTrains.filter(t => t.status === 'go_for_service').length,
    standby: mockTrains.filter(t => t.status === 'standby').length,
    inspection: mockTrains.filter(t => t.status === 'inspection_required').length
  };

  const locations = [...new Set(mockTrains.map(t => {
    if (t.currentLocation.includes('Terminal')) {
      return t.currentLocation.split(' - ')[0];
    }
    return t.currentLocation.split(' ')[0];
  }))];

  return (
    <div className="space-y-6">
      <div>
        <h1>Fleet Status</h1>
        <p className="text-muted-foreground">
          Real-time overview of all trainsets in your fleet
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Total Fleet</p>
                <p className="text-2xl">{statusCounts.total}</p>
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
                <p className="text-2xl">{statusCounts.operational}</p>
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
                <p className="text-sm text-muted-foreground">Standby</p>
                <p className="text-2xl">{statusCounts.standby}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Wrench className="h-4 w-4 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Inspection</p>
                <p className="text-2xl">{statusCounts.inspection}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="go_for_service">Go for Service</SelectItem>
                <SelectItem value="standby">Standby</SelectItem>
                <SelectItem value="inspection_required">Inspection Required</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Train ID</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="risk">AI Risk Score</SelectItem>
                <SelectItem value="mileage">Total Mileage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Fleet Data Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Train List
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Fleet Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Train Roster</CardTitle>
              <CardDescription>
                Showing {filteredTrains.length} of {mockTrains.length} trains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Train ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Current Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>AI Risk</TableHead>
                      <TableHead>Mileage</TableHead>
                      <TableHead>Next Maintenance</TableHead>
                      <TableHead>Next Certificate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrains.map((train) => (
                      <TableRow key={train.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono">{train.id}</TableCell>
                        <TableCell>{train.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {train.currentLocation}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(train.status)}>
                            {getStatusText(train.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={getRiskColor(train.aiRiskScore)}>
                            {Math.round(train.aiRiskScore * 100)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Fuel className="h-3 w-3 text-muted-foreground" />
                            {train.totalMileage.toLocaleString()} km
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Wrench className="h-3 w-3 text-muted-foreground" />
                            {train.nextMaintenanceDue} runs
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className={`h-3 w-3 ${train.nextCertificateExpiry <= 7 ? 'text-red-500' : 'text-muted-foreground'}`} />
                            {train.nextCertificateExpiry} days
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onTrainSelect(train.id)}
                          >
                            View Details
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

        <TabsContent value="map" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Location Map</CardTitle>
              <CardDescription>
                Real-time view of train positions, depots, and infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <MapComponent
                  locations={mockMapLocations}
                  center={[9.9312, 76.2673]}
                  zoom={11}
                  height="500px"
                  onLocationClick={handleLocationClick}
                  showControls={true}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
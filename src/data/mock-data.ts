import { Train, Certificate, JobCard, PredictiveAlert, DecisionLog, BrandingCommitment } from '../types/train';
import { MapLocation } from '../components/map-component';

// Mock trains data
export const mockTrains: Train[] = [
  {
    id: 'TRN-001',
    name: 'Express Metro 1',
    currentLocation: 'MG Road Station',
    status: 'go_for_service',
    aiRiskScore: 0.15,
    totalMileage: 145678,
    lastScanTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    lastScanTerminal: 'MG Road',
    nextMaintenanceDue: 12,
    nextCertificateExpiry: 45,
    brakeWearPercentage: 25,
    hvacStatus: 'normal',
    energyEfficiencyScore: 87,
    assignedBay: 'Bay 3',
    assignedRoute: 'Line 1'
  },
  {
    id: 'TRN-002',
    name: 'City Runner 2',
    currentLocation: 'Aluva Depot',
    status: 'inspection_required',
    aiRiskScore: 0.72,
    totalMileage: 198234,
    lastScanTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    lastScanTerminal: 'Aluva',
    nextMaintenanceDue: 3,
    nextCertificateExpiry: 7,
    brakeWearPercentage: 68,
    hvacStatus: 'degraded',
    energyEfficiencyScore: 62,
    assignedBay: 'Maintenance Bay 1'
  },
  {
    id: 'TRN-003',
    name: 'Metro Express 3',
    currentLocation: 'Line 1 - Palarivattom',
    status: 'go_for_service',
    aiRiskScore: 0.31,
    totalMileage: 87456,
    nextMaintenanceDue: 28,
    nextCertificateExpiry: 89,
    brakeWearPercentage: 42,
    hvacStatus: 'normal',
    energyEfficiencyScore: 91,
    assignedRoute: 'Line 1'
  },
  {
    id: 'TRN-004',
    name: 'Urban Shuttle 4',
    currentLocation: 'Kaloor Station',
    status: 'standby',
    aiRiskScore: 0.45,
    totalMileage: 156789,
    lastScanTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    lastScanTerminal: 'Kaloor',
    nextMaintenanceDue: 8,
    nextCertificateExpiry: 21,
    brakeWearPercentage: 55,
    hvacStatus: 'normal',
    energyEfficiencyScore: 78,
    assignedBay: 'Bay 1'
  },
  {
    id: 'TRN-005',
    name: 'Rapid Transit 5',
    currentLocation: 'Vyttila Station',
    status: 'go_for_service',
    aiRiskScore: 0.18,
    totalMileage: 92341,
    lastScanTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    lastScanTerminal: 'Vyttila',
    nextMaintenanceDue: 35,
    nextCertificateExpiry: 67,
    brakeWearPercentage: 33,
    hvacStatus: 'normal',
    energyEfficiencyScore: 89,
    assignedBay: 'Bay 2',
    assignedRoute: 'Line 1'
  }
];

// Mock certificates
export const mockCertificates: Certificate[] = [
  {
    id: 'CERT-001',
    trainId: 'TRN-001',
    type: 'Brake System Inspection',
    issuedDate: new Date('2024-01-15'),
    expiryDate: new Date('2025-01-15'),
    currentUsage: 0,
    status: 'valid'
  },
  {
    id: 'CERT-002',
    trainId: 'TRN-001',
    type: 'Safety Systems Check',
    issuedDate: new Date('2024-06-01'),
    usageLimit: 50000,
    currentUsage: 45000,
    status: 'expiring_soon'
  },
  {
    id: 'CERT-003',
    trainId: 'TRN-002',
    type: 'Brake Oil Certificate',
    issuedDate: new Date('2024-05-10'),
    usageLimit: 25000,
    currentUsage: 24800,
    status: 'expiring_soon'
  }
];

// Mock job cards
export const mockJobCards: JobCard[] = [
  {
    id: 'JC-001',
    trainId: 'TRN-002',
    title: 'HVAC System Repair',
    description: 'Air conditioning unit showing reduced efficiency',
    priority: 'high',
    status: 'in_progress',
    createdDate: new Date('2024-09-10'),
    dueDate: new Date('2024-09-20'),
    assignedTo: 'Mike Chen'
  },
  {
    id: 'JC-002',
    trainId: 'TRN-004',
    title: 'Door Sensor Calibration',
    description: 'Door sensor intermittently failing to detect obstacles',
    priority: 'medium',
    status: 'open',
    createdDate: new Date('2024-09-15'),
    dueDate: new Date('2024-09-25')
  },
  {
    id: 'JC-003',
    trainId: 'TRN-001',
    title: 'Routine Maintenance Check',
    description: 'Standard 30-day maintenance inspection',
    priority: 'low',
    status: 'closed',
    createdDate: new Date('2024-08-20'),
    assignedTo: 'Mike Chen'
  }
];

// Mock predictive alerts
export const mockPredictiveAlerts: PredictiveAlert[] = [
  {
    id: 'PA-001',
    trainId: 'TRN-002',
    component: 'HVAC Compressor',
    alertLevel: 'high',
    message: 'Vibration patterns indicate potential compressor failure in next 15 days',
    predictedFailureDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    confidence: 0.85,
    createdDate: new Date('2024-09-12')
  },
  {
    id: 'PA-002',
    trainId: 'TRN-004',
    component: 'Brake Pads',
    alertLevel: 'medium',
    message: 'Brake pad wear rate suggests replacement needed in 3 weeks',
    predictedFailureDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    confidence: 0.72,
    createdDate: new Date('2024-09-14')
  },
  {
    id: 'PA-003',
    trainId: 'TRN-001',
    component: 'Traction Motor',
    alertLevel: 'low',
    message: 'Motor temperature trending slightly higher than normal',
    predictedFailureDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    confidence: 0.63,
    createdDate: new Date('2024-09-16')
  }
];

// Mock decision logs
export const mockDecisionLogs: DecisionLog[] = [
  {
    id: 'DL-001',
    trainId: 'TRN-001',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    terminal: 'Terminal A',
    runId: 'RUN-20240917-001',
    decision: 'go_for_service',
    reason: 'All systems normal, energy-efficient bay assignment applied',
    supervisorId: '1',
    supervisorName: 'Sarah Johnson',
    wasOverridden: false,
    factors: {
      tcmsStatus: 'normal',
      certificatesValid: true,
      openJobCards: 0,
      brandingCompliant: true,
      aiRiskScore: 0.15,
      energyOptimized: true
    }
  },
  {
    id: 'DL-002',
    trainId: 'TRN-002',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    terminal: 'Terminal B',
    runId: 'RUN-20240917-002',
    decision: 'inspection_required',
    reason: 'Brake oil certificate expires in 2 runs, HVAC showing degraded performance',
    supervisorId: '1',
    supervisorName: 'Sarah Johnson',
    wasOverridden: false,
    factors: {
      tcmsStatus: 'warning',
      certificatesValid: false,
      openJobCards: 1,
      brandingCompliant: true,
      aiRiskScore: 0.72,
      energyOptimized: false
    }
  }
];

// Mock branding commitments
export const mockBrandingCommitments: BrandingCommitment[] = [
  {
    id: 'BC-001',
    trainId: 'TRN-001',
    advertiser: 'TechCorp Industries',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-12-01'),
    exposureTarget: 2000,
    currentExposure: 1750,
    status: 'on_track'
  },
  {
    id: 'BC-002',
    trainId: 'TRN-003',
    advertiser: 'Green Energy Solutions',
    startDate: new Date('2024-08-15'),
    endDate: new Date('2024-11-15'),
    exposureTarget: 1500,
    currentExposure: 1200,
    status: 'behind'
  },
  {
    id: 'BC-003',
    trainId: 'TRN-005',
    advertiser: 'Metro Foods',
    startDate: new Date('2024-09-10'),
    endDate: new Date('2024-10-10'),
    exposureTarget: 800,
    currentExposure: 850,
    status: 'ahead'
  }
];

// Mock map locations for trains and depots - Kochi Metro Route
export const mockMapLocations: MapLocation[] = [
  // Active trains on Kochi Metro
  {
    id: 'TRN-001',
    lat: 9.9312,
    lng: 76.2673,
    title: 'Express Metro 1',
    type: 'train',
    status: 'operational',
    details: {
      description: 'Currently at MG Road Station',
      trainNumber: 'TRN-001',
      capacity: 200,
      nextStop: 'Maharajas College',
      arrivalTime: '14:30'
    }
  },
  {
    id: 'TRN-002',
    lat: 10.0261,
    lng: 76.3479,
    title: 'City Runner 2',
    type: 'train',
    status: 'maintenance',
    details: {
      description: 'In maintenance at Aluva Depot',
      trainNumber: 'TRN-002',
      capacity: 180
    }
  },
  {
    id: 'TRN-003',
    lat: 9.9816,
    lng: 76.2999,
    title: 'Metro Express 3',
    type: 'train',
    status: 'operational',
    details: {
      description: 'Active on Line 1 - Palarivattom',
      trainNumber: 'TRN-003',
      capacity: 220,
      nextStop: 'JLN Stadium',
      arrivalTime: '15:15'
    }
  },
  {
    id: 'TRN-004',
    lat: 9.9398,
    lng: 76.2802,
    title: 'Urban Shuttle 4',
    type: 'train',
    status: 'operational',
    details: {
      description: 'At Kaloor Station',
      trainNumber: 'TRN-004',
      capacity: 160,
      nextStop: 'Town Hall',
      arrivalTime: '16:00'
    }
  },
  {
    id: 'TRN-005',
    lat: 9.8965,
    lng: 76.2592,
    title: 'Rapid Transit 5',
    type: 'train',
    status: 'operational',
    details: {
      description: 'At Vyttila Station',
      trainNumber: 'TRN-005',
      capacity: 200,
      nextStop: 'Thaikoodam',
      arrivalTime: '14:45'
    }
  },
  
  // Kochi Metro Stations (Blue Line)
  {
    id: 'STATION-ALUVA',
    lat: 10.0261,
    lng: 76.3479,
    title: 'Aluva',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Northern terminus of Kochi Metro',
      capacity: 500
    }
  },
  {
    id: 'STATION-KALAMASSERY',
    lat: 10.0536,
    lng: 76.3278,
    title: 'Kalamassery',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Major interchange station',
      capacity: 300
    }
  },
  {
    id: 'STATION-COCHIN-UNIVERSITY',
    lat: 10.0440,
    lng: 76.3193,
    title: 'Cochin University',
    type: 'station',
    status: 'operational',
    details: {
      description: 'University campus station',
      capacity: 200
    }
  },
  {
    id: 'STATION-PATHADIPALAM',
    lat: 10.0351,
    lng: 76.3115,
    title: 'Pathadipalam',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Residential area station',
      capacity: 150
    }
  },
  {
    id: 'STATION-EDAPALLY',
    lat: 10.0257,
    lng: 76.3081,
    title: 'Edapally',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Commercial hub station',
      capacity: 400
    }
  },
  {
    id: 'STATION-CHANGAMPUZHA',
    lat: 10.0148,
    lng: 76.3042,
    title: 'Changampuzha Park',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Park and recreational area',
      capacity: 180
    }
  },
  {
    id: 'STATION-PALARIVATTOM',
    lat: 9.9816,
    lng: 76.2999,
    title: 'Palarivattom',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Major business district station',
      capacity: 350
    }
  },
  {
    id: 'STATION-JLN-STADIUM',
    lat: 9.9579,
    lng: 76.2934,
    title: 'JLN Stadium',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Sports complex station',
      capacity: 250
    }
  },
  {
    id: 'STATION-KALOOR',
    lat: 9.9398,
    lng: 76.2802,
    title: 'Kaloor',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Cultural center area',
      capacity: 220
    }
  },
  {
    id: 'STATION-TOWN-HALL',
    lat: 9.9350,
    lng: 76.2755,
    title: 'Town Hall',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Administrative center',
      capacity: 300
    }
  },
  {
    id: 'STATION-MG-ROAD',
    lat: 9.9312,
    lng: 76.2673,
    title: 'MG Road',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Main commercial street',
      capacity: 400
    }
  },
  {
    id: 'STATION-MAHARAJAS',
    lat: 9.9281,
    lng: 76.2610,
    title: 'Maharajas College',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Educational institution area',
      capacity: 250
    }
  },
  {
    id: 'STATION-ERNAKULAM-SOUTH',
    lat: 9.9197,
    lng: 76.2605,
    title: 'Ernakulam South',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Railway junction connection',
      capacity: 450
    }
  },
  {
    id: 'STATION-KADAVANTHRA',
    lat: 9.9076,
    lng: 76.2598,
    title: 'Kadavanthra',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Residential and commercial area',
      capacity: 200
    }
  },
  {
    id: 'STATION-ELAMKULAM',
    lat: 9.9019,
    lng: 76.2593,
    title: 'Elamkulam',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Residential area station',
      capacity: 150
    }
  },
  {
    id: 'STATION-VYTTILA',
    lat: 9.8965,
    lng: 76.2592,
    title: 'Vyttila',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Major transport hub',
      capacity: 500
    }
  },
  {
    id: 'STATION-THAIKOODAM',
    lat: 9.8815,
    lng: 76.2531,
    title: 'Thaikoodam',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Waterfront area',
      capacity: 180
    }
  },
  {
    id: 'STATION-PETTAH',
    lat: 9.8742,
    lng: 76.2518,
    title: 'Pettah',
    type: 'station',
    status: 'operational',
    details: {
      description: 'Southern terminus',
      capacity: 300
    }
  },
  
  // Depots and Maintenance Facilities
  {
    id: 'DEPOT-MUTTOM',
    lat: 10.0015,
    lng: 76.3158,
    title: 'Muttom Depot',
    type: 'depot',
    status: 'operational',
    details: {
      description: 'Main metro depot and maintenance facility',
      capacity: 12
    }
  },
  {
    id: 'DEPOT-ALUVA',
    lat: 10.0261,
    lng: 76.3479,
    title: 'Aluva Terminal Depot',
    type: 'depot',
    status: 'operational',
    details: {
      description: 'Northern terminal depot',
      capacity: 6
    }
  },
  {
    id: 'DEPOT-PETTAH',
    lat: 9.8742,
    lng: 76.2518,
    title: 'Pettah Terminal Depot',
    type: 'depot',
    status: 'operational',
    details: {
      description: 'Southern terminal depot',
      capacity: 6
    }
  },
  
  // Maintenance Centers
  {
    id: 'MAINT-MUTTOM',
    lat: 10.0015,
    lng: 76.3158,
    title: 'Muttom Maintenance Center',
    type: 'maintenance',
    status: 'operational',
    details: {
      description: 'Primary maintenance and repair facility',
      capacity: 8
    }
  },
  {
    id: 'MAINT-KALAMASSERY',
    lat: 10.0536,
    lng: 76.3278,
    title: 'Kalamassery Maintenance Point',
    type: 'maintenance',
    status: 'operational',
    details: {
      description: 'Secondary maintenance facility',
      capacity: 4
    }
  }
];

// Helper function to get train locations
export const getTrainLocations = (): MapLocation[] => {
  return mockMapLocations.filter(location => location.type === 'train');
};

// Helper function to get depot locations
export const getDepotLocations = (): MapLocation[] => {
  return mockMapLocations.filter(location => location.type === 'depot');
};

// Helper function to get all infrastructure locations
export const getInfrastructureLocations = (): MapLocation[] => {
  return mockMapLocations.filter(location => location.type !== 'train');
};

// Mock Analyser Report data
export interface AnalyserReport {
  id: string;
  trainId: string;
  platformId: string;
  scanTimestamp: Date;
  recommendation: 'go_for_service' | 'replace' | 'maintenance_required';
  confidence: number;
  aiRiskScore: number;
  tcmsData: {
    doorSystem: 'normal' | 'warning' | 'fault';
    hvacSystem: 'normal' | 'warning' | 'fault';
    tractionSystem: 'normal' | 'warning' | 'fault';
    brakingSystem: 'normal' | 'warning' | 'fault';
    passengerInfoSystem: 'normal' | 'warning' | 'fault';
    lightingSystem: 'normal' | 'warning' | 'fault';
  };
  defectsIdentified: Array<{
    system: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    estimatedRepairTime: number; // in hours
  }>;
  replacementSuggestion?: {
    suggestedTrainId: string;
    reason: string;
    mileageComparison: string;
    brandingCompatibility: boolean;
  };
}

export const mockAnalyserReports: AnalyserReport[] = [
  {
    id: 'AR-001',
    trainId: 'TRN-001',
    platformId: 'Platform 3',
    scanTimestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    recommendation: 'go_for_service',
    confidence: 0.92,
    aiRiskScore: 0.15,
    tcmsData: {
      doorSystem: 'normal',
      hvacSystem: 'normal',
      tractionSystem: 'normal',
      brakingSystem: 'warning',
      passengerInfoSystem: 'normal',
      lightingSystem: 'normal',
    },
    defectsIdentified: [
      {
        system: 'Braking System',
        severity: 'low',
        description: 'Brake pad wear at 70%, within acceptable limits',
        estimatedRepairTime: 0
      }
    ]
  },
  {
    id: 'AR-002',
    trainId: 'TRN-003',
    platformId: 'Platform 1',
    scanTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    recommendation: 'replace',
    confidence: 0.87,
    aiRiskScore: 0.74,
    tcmsData: {
      doorSystem: 'fault',
      hvacSystem: 'warning',
      tractionSystem: 'normal',
      brakingSystem: 'normal',
      passengerInfoSystem: 'fault',
      lightingSystem: 'warning',
    },
    defectsIdentified: [
      {
        system: 'Door System',
        severity: 'high',
        description: 'Door 2 motor malfunction - intermittent failure',
        estimatedRepairTime: 4
      },
      {
        system: 'Passenger Info System',
        severity: 'medium',
        description: 'Display screen flickering in car 2',
        estimatedRepairTime: 2
      }
    ],
    replacementSuggestion: {
      suggestedTrainId: 'TRN-012',
      reason: 'Train TRN-012 is recommended because its mileage deficit is higher than the next available train, TRN-018. Both have low AI risk, but TRN-012 meets branding commitments.',
      mileageComparison: 'TRN-012: 245,680 km vs TRN-018: 287,450 km',
      brandingCompatibility: true
    }
  }
];

// Worker Tasks for the new mobile interface
export interface WorkerTask {
  id: string;
  trainId: string;
  title: string;
  description: string;
  assignedBy: string;
  assignedTo: string;
  bayNumber?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number; // in hours
  status: 'assigned' | 'in_progress' | 'completed';
  type: 'maintenance' | 'cleaning';
  assignedDate: Date;
  notes?: string;
}

export const mockWorkerTasks: WorkerTask[] = [
  {
    id: 'TASK-001',
    trainId: 'TRN-003',
    title: 'Repair HVAC Unit',
    description: 'Replace faulty compressor in car 2 HVAC system',
    assignedBy: 'Maintenance Manager',
    assignedTo: 'John Smith',
    bayNumber: 'Bay 4',
    priority: 'high',
    estimatedTime: 4,
    status: 'assigned',
    type: 'maintenance',
    assignedDate: new Date(),
    notes: 'Parts available in store room B-12'
  },
  {
    id: 'TASK-002',
    trainId: 'TRN-001',
    title: 'Full Interior Cleaning',
    description: 'Deep clean all passenger areas and sanitize',
    assignedBy: 'Cleaning Manager',
    assignedTo: 'Maria Garcia',
    bayNumber: 'Bay 2',
    priority: 'medium',
    estimatedTime: 3,
    status: 'in_progress',
    type: 'cleaning',
    assignedDate: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 'TASK-003',
    trainId: 'TRN-005',
    title: 'Replace Door Motor',
    description: 'Install new door motor for door 3 in car 1',
    assignedBy: 'Maintenance Manager',
    assignedTo: 'John Smith',
    bayNumber: 'Bay 1',
    priority: 'medium',
    estimatedTime: 2,
    status: 'completed',
    type: 'maintenance',
    assignedDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    notes: 'Completed ahead of schedule'
  }
];

// Additional mock data for extended dashboards
export interface ExtendedCertificate extends Certificate {
  expiryCondition?: string;
  runsRemaining?: number;
  kmRemaining?: number;
  documentsUploaded?: boolean;
}

export const mockExtendedCertificates: ExtendedCertificate[] = [
  {
    id: 'CERT-004',
    trainId: 'TRN-002',
    type: 'Brake Oil Certificate',
    issuedDate: new Date('2024-05-10'),
    usageLimit: 25000,
    currentUsage: 24800,
    status: 'expiring_soon',
    expiryCondition: 'Expires in 2 runs',
    runsRemaining: 2,
    documentsUploaded: false
  },
  {
    id: 'CERT-005',
    trainId: 'TRN-004',
    type: 'HVAC Fitness Certificate',
    issuedDate: new Date('2024-08-01'),
    expiryDate: new Date('2025-02-01'),
    status: 'expiring_soon',
    expiryCondition: 'Expires in 3 days',
    documentsUploaded: true
  },
  {
    id: 'CERT-006',
    trainId: 'TRN-003',
    type: 'Telecom Systems Check',
    issuedDate: new Date('2024-07-15'),
    usageLimit: 30000,
    currentUsage: 29550,
    status: 'expiring_soon',
    expiryCondition: 'Expires in 45 km',
    kmRemaining: 450,
    documentsUploaded: false
  }
];

export interface JobCardClosure {
  id: string;
  trainId: string;
  jobCardNumber: string;
  workSummary: string;
  completedBy: string;
  completedDate: Date;
  status: 'pending_closure' | 'verified' | 'closed';
  maximoReference: string;
}

export const mockJobCardClosures: JobCardClosure[] = [
  {
    id: 'JCC-001',
    trainId: 'TRN-002',
    jobCardNumber: 'MAX-2024-1001',
    workSummary: 'HVAC compressor replacement completed, system tested and operational',
    completedBy: 'Tech Team Alpha',
    completedDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'pending_closure',
    maximoReference: 'WO-HVAC-2024-0918-002'
  },
  {
    id: 'JCC-002',
    trainId: 'TRN-004',
    jobCardNumber: 'MAX-2024-1002',
    workSummary: 'Door sensor calibration and alignment completed successfully',
    completedBy: 'Tech Team Beta',
    completedDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: 'pending_closure',
    maximoReference: 'WO-DOOR-2024-0917-004'
  }
];

export interface CampaignLog {
  id: string;
  trainId: string;
  campaignName: string;
  logEntry: string;
  timestamp: Date;
  type: 'conflict' | 'opportunity' | 'achievement';
}

export const mockCampaignLogs: CampaignLog[] = [
  {
    id: 'CL-001',
    trainId: 'TRN-003',
    campaignName: 'Green Energy Solutions',
    logEntry: 'RUN-2025-09-18-2200: Train TRN-003 (Green Energy Solutions) was sent to IBL due to a predictive maintenance alert. Exposure target missed by 2 hours.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'conflict'
  },
  {
    id: 'CL-002',
    trainId: 'TRN-005',
    campaignName: 'Metro Foods',
    logEntry: 'Opportunity: Train TRN-005 has a mileage deficit of 300 km and can be assigned priority runs to meet its branding target',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    type: 'opportunity'
  },
  {
    id: 'CL-003',
    trainId: 'TRN-001',
    campaignName: 'TechCorp Industries',
    logEntry: 'Achievement: Campaign TechCorp Industries exceeded daily exposure target by 15%',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    type: 'achievement'
  }
];

export interface CleaningQueue {
  id: string;
  trainId: string;
  arrivalTime: Date;
  status: 'pending_inspection' | 'ready_for_cleaning' | 'cleaning_in_progress' | 'completed';
  assignedWorker?: string;
  estimatedCompletion?: Date;
  bay?: string;
}

export const mockCleaningQueue: CleaningQueue[] = [
  {
    id: 'CQ-001',
    trainId: 'TRN-001',
    arrivalTime: new Date(Date.now() - 30 * 60 * 1000),
    status: 'cleaning_in_progress',
    assignedWorker: 'Maria Garcia',
    estimatedCompletion: new Date(Date.now() + 90 * 60 * 1000),
    bay: 'Cleaning Bay 1'
  },
  {
    id: 'CQ-002',
    trainId: 'TRN-004',
    arrivalTime: new Date(Date.now() - 15 * 60 * 1000),
    status: 'ready_for_cleaning',
    bay: 'Cleaning Bay 2'
  },
  {
    id: 'CQ-003',
    trainId: 'TRN-005',
    arrivalTime: new Date(Date.now() - 5 * 60 * 1000),
    status: 'pending_inspection'
  }
];

export interface Worker {
  id: string;
  name: string;
  type: 'cleaning' | 'maintenance';
  status: 'available' | 'assigned' | 'on_break';
  currentTask?: string;
  shiftEndTime: Date;
}

export const mockWorkers: Worker[] = [
  {
    id: 'W-001',
    name: 'Maria Garcia',
    type: 'cleaning',
    status: 'assigned',
    currentTask: 'TRN-001 - Full Interior Cleaning',
    shiftEndTime: new Date(Date.now() + 6 * 60 * 60 * 1000)
  },
  {
    id: 'W-002',
    name: 'Raj Kumar',
    type: 'cleaning',
    status: 'available',
    shiftEndTime: new Date(Date.now() + 5 * 60 * 60 * 1000)
  },
  {
    id: 'W-003',
    name: 'John Smith',
    type: 'maintenance',
    status: 'assigned',
    currentTask: 'TRN-003 - HVAC Repair',
    shiftEndTime: new Date(Date.now() + 7 * 60 * 60 * 1000)
  },
  {
    id: 'W-004',
    name: 'Alice Brown',
    type: 'maintenance',
    status: 'available',
    shiftEndTime: new Date(Date.now() + 4 * 60 * 60 * 1000)
  }
];

export interface MaintenanceTriage {
  id: string;
  trainId: string;
  flaggedFor: string;
  flaggedBy: 'ai' | 'supervisor' | 'predictive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending_diagnosis' | 'diagnosed' | 'assigned' | 'in_progress';
  diagnosisNotes?: string;
  assignedTechnician?: string;
  estimatedCompletionTime?: number;
}

export const mockMaintenanceTriage: MaintenanceTriage[] = [
  {
    id: 'MT-001',
    trainId: 'TRN-002',
    flaggedFor: 'Critical TCMS Alert - HVAC System Degraded Performance',
    flaggedBy: 'ai',
    priority: 'critical',
    status: 'in_progress',
    diagnosisNotes: 'Compressor replacement required, parts ordered',
    assignedTechnician: 'John Smith',
    estimatedCompletionTime: 6
  },
  {
    id: 'MT-002',
    trainId: 'TRN-004',
    flaggedFor: 'Predictive Alert - Brake Pad Wear Pattern',
    flaggedBy: 'predictive',
    priority: 'medium',
    status: 'diagnosed',
    diagnosisNotes: 'Brake pad replacement required within 3 weeks',
    estimatedCompletionTime: 4
  },
  {
    id: 'MT-003',
    trainId: 'TRN-001',
    flaggedFor: 'Supervisor Override - Unusual Noise Reported',
    flaggedBy: 'supervisor',
    priority: 'high',
    status: 'pending_diagnosis'
  }
];
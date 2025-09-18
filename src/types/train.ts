export type TrainStatus = 'go_for_service' | 'standby' | 'inspection_required';
export type AlertLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Train {
  id: string;
  name: string;
  currentLocation: string;
  status: TrainStatus;
  aiRiskScore: number;
  totalMileage: number;
  lastScanTime?: Date;
  lastScanTerminal?: string;
  nextMaintenanceDue: number; // in runs
  nextCertificateExpiry: number; // in days
  brakeWearPercentage: number;
  hvacStatus: 'normal' | 'degraded' | 'offline';
  energyEfficiencyScore: number;
  assignedBay?: string;
  assignedRoute?: string;
}

export interface Certificate {
  id: string;
  trainId: string;
  type: string;
  issuedDate: Date;
  expiryDate?: Date;
  usageLimit?: number; // in km or runs
  currentUsage: number;
  status: 'valid' | 'expiring_soon' | 'expired';
}

export interface JobCard {
  id: string;
  trainId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'closed';
  createdDate: Date;
  dueDate?: Date;
  assignedTo?: string;
}

export interface PredictiveAlert {
  id: string;
  trainId: string;
  component: string;
  alertLevel: AlertLevel;
  message: string;
  predictedFailureDate: Date;
  confidence: number;
  createdDate: Date;
}

export interface DecisionLog {
  id: string;
  trainId: string;
  timestamp: Date;
  terminal: string;
  runId: string;
  decision: TrainStatus;
  reason: string;
  supervisorId: string;
  supervisorName: string;
  wasOverridden: boolean;
  overrideReason?: string;
  factors: {
    tcmsStatus: 'normal' | 'warning' | 'critical';
    certificatesValid: boolean;
    openJobCards: number;
    brandingCompliant: boolean;
    aiRiskScore: number;
    energyOptimized: boolean;
  };
}

export interface BrandingCommitment {
  id: string;
  trainId: string;
  advertiser: string;
  startDate: Date;
  endDate: Date;
  exposureTarget: number; // in hours
  currentExposure: number;
  status: 'on_track' | 'behind' | 'ahead';
}
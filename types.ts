
export enum UserRole {
  DIRECTOR = 'Director',
  DEPUTY_DIRECTOR = 'Deputy Director',
  ASSISTANT_DIRECTOR = 'Assistant Director',
  SAC = 'Special Agent in Charge',
  SSA = 'Supervisory Special Agent',
  SPECIAL_AGENT = 'Special Agent',
  ANALYST = 'Intelligence Analyst',
  SUPPORT = 'Technical Support'
}

export enum UserStatus {
  AVAILABLE = 'Available',
  BUSY = 'Busy',
  OFF_DUTY = 'Off-duty'
}

export enum POITag {
  SUSPECT = 'Suspect',
  WITNESS = 'Witness',
  INFORMANT = 'Informant',
  PERSONNEL = 'Personnel'
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface SecureFile {
  id: string;
  name: string;
  type: string;
  url: string;
  timestamp: string;
}

export interface SecureAudio {
  id: string;
  label: string;
  duration: string;
  url: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  badgeNumber: string;
  status: UserStatus;
  securityCode: string;
  lastCheckIn?: string;
  specialization?: string;
  biometricIntegrity?: number;
  threatLevel?: number; 
}

export interface ReconImage {
  id: string;
  url: string;
  timestamp: string;
  type: 'Satellite' | 'Thermal' | 'Drone' | 'FacialAging';
  coords: string;
}

export interface POI {
  id: string;
  name: string;
  dob: string;
  ssn: string;
  aliases: string[];
  addresses: string[];
  tags: POITag[];
  riskLevel: RiskLevel;
  photoUrl: string;
  lastUpdated: string;
  updatedBy: string;
  patternOfLife?: string;
  facialAgingPredictions?: ReconImage[];
  audioLogs?: SecureAudio[];
  documents?: SecureFile[];
  notes?: string;
}

export interface Mission {
  id: string;
  codeName: string;
  status: 'Planning' | 'Active' | 'Extraction' | 'Complete' | 'Failed';
  riskRating: number;
  assets: string[];
  targetId: string;
  roe: string;
  startTime: string;
  extractionTime: string;
  events: { time: string; description: string; decisionBy: string; aiCritique?: string }[];
  reconImages?: ReconImage[];
  // Added optional fields to resolve errors in MissionControl.tsx
  exfilCorridor?: string;
  quantumUncertainty?: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  isSanitized?: boolean;
}

export interface Alert {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  message: string;
  from: string;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface IncidentReport {
  id: string;
  category: string;
  description: string;
  location: string;
  timestamp: string;
  agentId: string;
  status: string;
  redactedDescription?: string;
}

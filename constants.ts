
import { UserRole, UserStatus, POITag, RiskLevel, User, POI } from './types';

export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'AGENT FALCON', 
    role: UserRole.DIRECTOR, 
    badgeNumber: 'F0', 
    status: UserStatus.AVAILABLE,
    securityCode: 'F008F008',
    specialization: 'Command & Strategy',
    biometricIntegrity: 100
  },
  { 
    id: 'u2', 
    name: 'AGENT VANCE', 
    role: UserRole.SSA, 
    badgeNumber: 'FED-8842', 
    status: UserStatus.BUSY, 
    securityCode: 'PASS1234',
    lastCheckIn: '2023-10-27T10:00:00Z',
    specialization: 'Counter-Terrorism',
    biometricIntegrity: 94
  },
  { 
    id: 'u3', 
    name: 'AGENT ROSS', 
    role: UserRole.SPECIAL_AGENT, 
    badgeNumber: 'FED-7712', 
    status: UserStatus.OFF_DUTY,
    securityCode: 'PASS1234',
    specialization: 'Undercover Ops',
    biometricIntegrity: 88
  },
  { 
    id: 'u4', 
    name: 'AGENT FISHER', 
    role: UserRole.ANALYST, 
    badgeNumber: 'FED-4421', 
    status: UserStatus.AVAILABLE,
    securityCode: 'PASS1234',
    specialization: 'Signal Intel',
    biometricIntegrity: 99
  },
  { 
    id: 'u5', 
    name: 'AGENT KING', 
    role: UserRole.SAC, 
    badgeNumber: 'FED-1102', 
    status: UserStatus.AVAILABLE,
    securityCode: 'PASS1234',
    specialization: 'Forensics',
    biometricIntegrity: 92
  },
];

export const MOCK_POIS: POI[] = [
  {
    id: 'p1',
    name: 'Viktor "The Ghost" Reznov',
    dob: '1975-05-14',
    ssn: '***-**-6789',
    aliases: ['Rez', 'Spirit'],
    addresses: ['123 Industrial Way, Sector 7', 'Unlisted Safehouse'],
    tags: [POITag.SUSPECT],
    riskLevel: RiskLevel.CRITICAL,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    lastUpdated: '2023-10-25T14:30:00Z',
    updatedBy: 'AGENT VANCE'
  },
  {
    id: 'p2',
    name: 'Elena Sokolov',
    dob: '1988-11-02',
    ssn: '***-**-1122',
    aliases: ['Lena'],
    addresses: ['Apartment 4B, Blue Towers'],
    tags: [POITag.WITNESS],
    riskLevel: RiskLevel.MEDIUM,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    lastUpdated: '2023-10-26T09:15:00Z',
    updatedBy: 'AGENT ROSS'
  }
];

export const INCIDENT_CATEGORIES = ['Surveillance', 'Apprehension', 'Evidence Collection', 'Other'] as const;

import { Program } from '@/types/Program';

export interface WeightDetail {
  _id: string;
  weight: number;
  date: string;
}

export interface MeasurementDetail {
  _id: string;
  measurementType: string;
  value: number;
  date: string;
}

export interface ConnectedDevice {
  type: 'apple-watch' | 'garmin' | 'fitbit' | null;
  enabled: boolean;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  weightHistory: WeightDetail[];
  measurementsHistory: MeasurementDetail[];
  activeProgram?: string;
  emailVerified: boolean;
  isActive: boolean;
  connectedDevice: ConnectedDevice;
}

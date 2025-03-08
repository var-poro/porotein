import { Program } from '@/types/Program';

export interface WeightDetail {
  _id: string;
  weight: number;
  date: Date;
}

export interface MeasurementDetail {
  measurementType: string;
  value: number;
  date: Date;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  weightHistory: WeightDetail[];
  measurementsHistory: MeasurementDetail[];
  activeProgram: string | Program;
}

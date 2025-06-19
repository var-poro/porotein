export type ExerciseType = 'strength' | 'cardio';

export interface CardioSegment {
  name?: string;
  distance?: number;
  distanceUnit?: 'm' | 'km';
  duration?: number;
  durationUnit?: 's' | 'min';
  pace?: number;
  paceUnit?: 'min/km' | 'km/h';
  calories?: number;
  avgHeartRate?: number;
  intensity?: number;
  heartRateZone?: number;
  notes?: string;
  order?: number;
}

export interface Exercise {
  _id?: string;
  name: string;
  videoUrl?: string;
  description: string;
  tags: string[];
  targetMuscles: string[];
  difficulty?: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  type: ExerciseType;
  repSets?: RepSet[];
  segments?: CardioSegment[];
}

export interface RepSet {
  _id?: string;
  repetitions: number;
  duration?: number;
  weight: number;
  restTime: number;
}

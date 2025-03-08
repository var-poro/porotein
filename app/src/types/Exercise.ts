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
  repSets: RepSet[];
}

export interface RepSet {
  _id?: string;
  repetitions: number;
  duration?: number;
  weight: number;
  restTime: number;
}

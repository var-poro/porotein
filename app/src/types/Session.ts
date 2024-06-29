import { Exercise } from '@/types/Exercise.ts';

export interface Session {
  _id: string;
  programId: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  exercises: Exercise[];
}

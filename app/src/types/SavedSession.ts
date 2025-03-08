import { Session } from '@/types/Session.ts';
import { Exercise, RepSet } from './Exercise';

export interface SavedSession extends Session {
  performedAt: string;
  duration: number;
  sessionId: string;
  session: Session;
  savedExercises: SavedExercise[]
}

export interface SavedExercise extends Exercise {
  duration: number;
  exerciseId: string;
  exercise: Exercise;
  savedRepSets: SavedRepSet[]
}

export interface SavedRepSet extends RepSet {
  repSetId: string;
  repSet: RepSet;
}

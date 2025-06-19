import { Session } from '@/types/Session.ts';
import { Exercise, RepSet, CardioSegment } from './Exercise';

export interface SavedSession extends Session {
  performedAt: string;
  duration: number;
  sessionId: string;
  session: Session;
  savedExercises: SavedExercise[];
}

export interface SavedExercise extends Exercise {
  duration: number;
  exerciseId: {
    _id: string;
    id: string;
  };
  exercise: Exercise;
  savedRepSets?: SavedRepSet[];
  savedSegments?: SavedCardioSegment[];
}

export interface SavedRepSet extends RepSet {
  repSetId: string;
  repSet: RepSet;
}

export interface SavedCardioSegment extends CardioSegment {
  segmentId: string;
  segment: CardioSegment;
}

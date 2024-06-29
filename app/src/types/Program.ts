import { Session } from '@/types/Session.ts';

export interface Program {
  _id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
  sessions: Session[];
}

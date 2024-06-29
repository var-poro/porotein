import { Document, model, Schema, Types } from 'mongoose';
import { IExercise } from './Exercise';

interface ISession extends Document {
  programId: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  exercises: Types.DocumentArray<IExercise>;
}

const sessionSchema = new Schema<ISession>({
  programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }],
});

const Session = model<ISession>('Session', sessionSchema);

export default Session;
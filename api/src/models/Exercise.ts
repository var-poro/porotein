import { Document, model, Schema, Types } from 'mongoose';

interface IRepSet {
  repetitions: number;
  weight: number;
  restTime: number;
}

export interface IExercise extends Document {
  name: string;
  videoUrl?: string;
  description: string;
  tags: Types.ObjectId[];
  targetMuscles: Types.ObjectId[];
  difficulty?: string;
  repSets: Types.DocumentArray<IRepSet>;
  createdAt: Date;
  updatedAt: Date;
}

const repSetSchema = new Schema<IRepSet>({
  repetitions: { type: Number, required: true },
  weight: { type: Number, required: true },
  restTime: { type: Number, required: true },
});

const exerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  videoUrl: { type: String },
  description: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  targetMuscles: [{ type: Schema.Types.ObjectId, ref: 'Muscle' }],
  difficulty: { type: String },
  repSets: [repSetSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Exercise = model<IExercise>('Exercise', exerciseSchema);

export default Exercise;
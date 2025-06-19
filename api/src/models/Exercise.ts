import { Document, model, Schema, Types } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     CardioSegment:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nom du segment cardio
 *         distance:
 *           type: number
 *           description: Distance du segment
 *         distanceUnit:
 *           type: string
 *           enum: [m, km]
 *           description: Unité de distance
 *         duration:
 *           type: number
 *           description: Durée du segment
 *         durationUnit:
 *           type: string
 *           enum: [s, min]
 *           description: Unité de durée
 *         pace:
 *           type: number
 *           description: Allure ou vitesse
 *         paceUnit:
 *           type: string
 *           enum: [min/km, km/h]
 *           description: Unité d'allure
 *         calories:
 *           type: number
 *           description: Calories dépensées
 *         avgHeartRate:
 *           type: number
 *           description: Fréquence cardiaque moyenne
 *         intensity:
 *           type: number
 *           description: Intensité (1 = facile, 2 = modéré, 3 = intense, etc.)
 *         heartRateZone:
 *           type: number
 *           description: Zone de fréquence cardiaque
 *         notes:
 *           type: string
 *           description: Notes ou ressenti
 *         order:
 *           type: number
 *           description: Ordre du segment
 *     Exercise:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         name:
 *           type: string
 *         videoUrl:
 *           type: string
 *         description:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         targetMuscles:
 *           type: array
 *           items:
 *             type: string
 *         difficulty:
 *           type: string
 *         type:
 *           type: string
 *           enum: [strength, cardio]
 *         repSets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RepSet'
 *         segments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CardioSegment'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

interface ICardioSegment {
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
  type: 'strength' | 'cardio';
  repSets?: Types.DocumentArray<IRepSet>;
  segments?: ICardioSegment[];
  createdAt: Date;
  updatedAt: Date;
}

const repSetSchema = new Schema<IRepSet>({
  repetitions: { type: Number, required: true },
  weight: { type: Number, required: true },
  restTime: { type: Number, required: true },
});

const cardioSegmentSchema = new Schema<ICardioSegment>({
  name: { type: String },
  distance: { type: Number },
  distanceUnit: { type: String, enum: ['m', 'km'] },
  duration: { type: Number },
  durationUnit: { type: String, enum: ['s', 'min'] },
  pace: { type: Number },
  paceUnit: { type: String, enum: ['min/km', 'km/h'] },
  calories: { type: Number },
  avgHeartRate: { type: Number },
  intensity: { type: Number },
  heartRateZone: { type: Number },
  notes: { type: String },
  order: { type: Number },
});

const exerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  videoUrl: { type: String },
  description: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  targetMuscles: [{ type: Schema.Types.ObjectId, ref: 'Muscle' }],
  difficulty: { type: String },
  type: { type: String, enum: ['strength', 'cardio'], required: true },
  repSets: [repSetSchema],
  segments: [cardioSegmentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Exercise = model<IExercise>('Exercise', exerciseSchema);

export default Exercise;
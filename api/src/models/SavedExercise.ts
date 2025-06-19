import {Document, model, Schema, Types} from 'mongoose';

interface ISavedRepSet {
    repSetId: Types.ObjectId; // Référence vers le set d'origine
    repetitions: number;
    weight: number;
    restTime: number;
    duration: number;
}

interface ISavedCardioSegment {
    segmentId: Types.ObjectId;
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

export interface ISavedExercise extends Document {
    exerciseId: Types.ObjectId; // Référence vers l'exercice d'origine
    name: string;
    repSets?: Types.DocumentArray<ISavedRepSet>;
    savedSegments?: ISavedCardioSegment[];
    duration: number;
    performedAt: Date;
}

const savedRepSetSchema = new Schema<ISavedRepSet>({
    repSetId: {type: Schema.Types.ObjectId, required: true},
    repetitions: {type: Number, required: true},
    weight: {type: Number, required: true},
    restTime: {type: Number, required: true},
    duration: {type: Number, required: true},
});

const savedCardioSegmentSchema = new Schema<ISavedCardioSegment>({
    segmentId: {type: Schema.Types.ObjectId, required: true},
    name: {type: String},
    distance: {type: Number},
    distanceUnit: {type: String, enum: ['m', 'km']},
    duration: {type: Number},
    durationUnit: {type: String, enum: ['s', 'min']},
    pace: {type: Number},
    paceUnit: {type: String, enum: ['min/km', 'km/h']},
    calories: {type: Number},
    avgHeartRate: {type: Number},
    intensity: {type: Number},
    heartRateZone: {type: Number},
    notes: {type: String},
    order: {type: Number},
});

export const savedExerciseSchema = new Schema<ISavedExercise>({
    exerciseId: {type: Schema.Types.ObjectId, ref: 'Exercise', required: true},
    name: {type: String, required: true},
    repSets: [savedRepSetSchema],
    savedSegments: [savedCardioSegmentSchema],
    duration: {type: Number, required: true},
    performedAt: {type: Date, default: Date.now},
});

const SavedExercise = model<ISavedExercise>('SavedExercise', savedExerciseSchema);

export default SavedExercise;

/**
 * @swagger
 * components:
 *   schemas:
 *     SavedCardioSegment:
 *       type: object
 *       properties:
 *         segmentId:
 *           type: string
 *           description: Identifiant du segment cardio sauvegardé
 *         name:
 *           type: string
 *         distance:
 *           type: number
 *         distanceUnit:
 *           type: string
 *           enum: [m, km]
 *         duration:
 *           type: number
 *         durationUnit:
 *           type: string
 *           enum: [s, min]
 *         pace:
 *           type: number
 *         paceUnit:
 *           type: string
 *           enum: [min/km, km/h]
 *         calories:
 *           type: number
 *         avgHeartRate:
 *           type: number
 *         intensity:
 *           type: number
 *         heartRateZone:
 *           type: number
 *         notes:
 *           type: string
 *         order:
 *           type: number
 *     SavedExercise:
 *       type: object
 *       required:
 *         - exerciseId
 *         - name
 *         - duration
 *       properties:
 *         exerciseId:
 *           type: string
 *         name:
 *           type: string
 *         repSets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SavedRepSet'
 *         savedSegments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SavedCardioSegment'
 *         duration:
 *           type: number
 *         performedAt:
 *           type: string
 *           format: date-time
 */
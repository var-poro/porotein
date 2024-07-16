import {Document, model, Schema, Types} from 'mongoose';

interface ISavedRepSet {
    repSetId: Types.ObjectId; // Référence vers le set d'origine
    repetitions: number;
    weight: number;
    restTime: number;
    duration: number;
}

export interface ISavedExercise extends Document {
    exerciseId: Types.ObjectId; // Référence vers l'exercice d'origine
    name: string;
    repSets: Types.DocumentArray<ISavedRepSet>;
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

export const savedExerciseSchema = new Schema<ISavedExercise>({
    exerciseId: {type: Schema.Types.ObjectId, ref: 'Exercise', required: true},
    name: {type: String, required: true},
    repSets: [savedRepSetSchema],
    duration: {type: Number, required: true},
    performedAt: {type: Date, default: Date.now},
});

const SavedExercise = model<ISavedExercise>('SavedExercise', savedExerciseSchema);

export default SavedExercise;
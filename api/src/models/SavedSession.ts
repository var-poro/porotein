import {Document, model, Schema, Types} from 'mongoose';
import {ISavedExercise, savedExerciseSchema} from './SavedExercise';

interface ISavedSession extends Document {
    userId: Types.ObjectId; // Référence vers l'utilisateur
    programId: Types.ObjectId; // Référence vers le programme d'origine
    exercises: Types.DocumentArray<ISavedExercise>;
    duration: number;
    performedAt: Date;
}

const savedSessionSchema = new Schema<ISavedSession>({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    programId: {type: Schema.Types.ObjectId, ref: 'Program', required: true},
    exercises: [savedExerciseSchema],
    duration: {type: Number, required: true},
    performedAt: {type: Date, default: Date.now},
});

const SavedSession = model<ISavedSession>('SavedSession', savedSessionSchema);

export default SavedSession;
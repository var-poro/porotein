import { Document, model, Schema, Types } from 'mongoose';
import { ISavedExercise, savedExerciseSchema } from './SavedExercise';
import Session from './Session';
import Exercise from './Exercise';

interface ISavedSession extends Document {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  sessionId: Types.ObjectId;
  programId: Types.ObjectId;
  savedExercises: Types.DocumentArray<ISavedExercise>;
  duration: number;
  performedAt: Date;
}

const savedSessionSchema = new Schema<ISavedSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: false },
  programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
  savedExercises: [savedExerciseSchema],
  duration: { type: Number, required: true },
  performedAt: { type: Date, default: Date.now },
});

savedSessionSchema.virtual('session', {
  ref: 'Session',
  localField: 'sessionId',
  foreignField: '_id',
  justOne: true,
});

savedSessionSchema.set('toObject', { virtuals: true });
savedSessionSchema.set('toJSON', { virtuals: true });

savedSessionSchema.pre('save', async function (next) {
  console.log('Pre-save middleware triggered');
  console.log('Document content:', JSON.stringify(this.toObject(), null, 2));
  next();
});

savedSessionSchema.post('save', async function (doc) {
  console.log('Post-save middleware starting...');
  
  const savedSession = await SavedSession.findById(doc._id);
  if (!savedSession?.sessionId) {
    console.log('No sessionId found in saved session');
    return;
  }

  try {
    const session = await Session.findById(savedSession.sessionId).populate('exercises');
    if (!session) {
      console.log('Original session not found');
      return;
    }

    console.log('Session before update:', JSON.stringify(session, null, 2));

    for (const exercise of session.exercises) {
      const savedExercise = savedSession.savedExercises.find(
        (ex: ISavedExercise) => ex.exerciseId.toString() === exercise._id?.toString()
      );
      
      if (savedExercise) {
        console.log(`Updating exercise ${exercise._id}`);
        console.log('New repSets:', savedExercise.repSets);
        
        await Exercise.findByIdAndUpdate(
          exercise._id,
          {
            $set: {
              repSets: savedExercise.repSets.map((rs: { repetitions: number; weight: number; restTime: number }) => ({
                repetitions: Number(rs.repetitions),
                weight: Number(rs.weight),
                restTime: Number(rs.restTime)
              }))
            }
          }
        );
      }
    }

    const updatedSession = await Session.findById(session._id).populate('exercises');
    console.log('Updated session:', JSON.stringify(updatedSession?.exercises, null, 2));
    console.log('Session updated successfully');
  } catch (error) {
    console.error('Error in post-save middleware:', error);
  }
});

const SavedSession = model<ISavedSession>('SavedSession', savedSessionSchema);

export default SavedSession;
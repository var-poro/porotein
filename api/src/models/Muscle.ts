import { Schema, model, Document } from 'mongoose';

interface IMuscle extends Document {
    name: string;
    description: string;
}

const muscleSchema = new Schema<IMuscle>({
    name: { type: String, required: true },
    description: { type: String }
});

const Muscle = model<IMuscle>('Muscle', muscleSchema);

export default Muscle;
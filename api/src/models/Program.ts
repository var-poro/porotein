import { Schema, model, Document } from 'mongoose';

interface IProgram extends Document {
    userId: Schema.Types.ObjectId;
    name: string;
    description: string;
    createdAt: Date;
    sessions: Schema.Types.ObjectId[];
}

const programSchema = new Schema<IProgram>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }]
});

const Program = model<IProgram>('Program', programSchema);

export default Program;
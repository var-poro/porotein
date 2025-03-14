import { Schema, model, Document } from 'mongoose';

interface ISupplement extends Document {
    userId: Schema.Types.ObjectId;
    name: string;
    description: string;
    type: string;
    createdAt: Date;
}

const supplementSchema = new Schema<ISupplement>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Supplement = model<ISupplement>('Supplement', supplementSchema);

export default Supplement;
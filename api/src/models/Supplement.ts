import { Schema, model, Document } from 'mongoose';

interface ISupplementNotification {
    time: Date;
    message: string;
}

interface ISupplement extends Document {
    userId: Schema.Types.ObjectId;
    name: string;
    description: string;
    type: string;
    createdAt: Date;
    notifications: ISupplementNotification[];
}

const supplementNotificationSchema = new Schema<ISupplementNotification>({
    time: { type: Date, required: true },
    message: { type: String, required: true }
});

const supplementSchema = new Schema<ISupplement>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    notifications: [supplementNotificationSchema]
});

const Supplement = model<ISupplement>('Supplement', supplementSchema);

export default Supplement;
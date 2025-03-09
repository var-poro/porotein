import { Schema, model, Document } from 'mongoose';

interface IPushSubscription extends Document {
    userId: Schema.Types.ObjectId;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    createdAt: Date;
}

const pushSubscriptionSchema = new Schema<IPushSubscription>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    endpoint: { type: String, required: true },
    keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

// Index unique sur userId + endpoint pour éviter les doublons
pushSubscriptionSchema.index({ userId: 1, endpoint: 1 }, { unique: true });

const PushSubscription = model<IPushSubscription>('PushSubscription', pushSubscriptionSchema);

export default PushSubscription; 
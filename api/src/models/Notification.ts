import { Schema, model, Document } from 'mongoose';

interface INotification extends Document {
    userId: Schema.Types.ObjectId;
    message: string;
    date: Date;
    isRead: boolean;
}

const notificationSchema = new Schema<INotification>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

const Notification = model<INotification>('Notification', notificationSchema);

export default Notification;
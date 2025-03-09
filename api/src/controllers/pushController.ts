import { Request, Response } from 'express';
import webpush from 'web-push';
import PushSubscription from '../models/PushSubscription';

interface AuthRequest extends Request {
    userId?: string;
}

// Configuration de web-push avec les clés VAPID
webpush.setVapidDetails(
    'mailto:your-email@example.com', // Remplacez par votre email
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export const subscribe = async (req: AuthRequest, res: Response) => {
    try {
        const subscription = new PushSubscription({
            userId: req.userId,
            endpoint: req.body.endpoint,
            keys: {
                p256dh: req.body.keys.p256dh,
                auth: req.body.keys.auth
            }
        });

        await subscription.save();
        res.status(201).json({ message: 'Subscription saved successfully' });
    } catch (error) {
        console.error('Error saving push subscription:', error);
        res.status(500).json({ error: 'Error saving subscription' });
    }
};

export const unsubscribe = async (req: AuthRequest, res: Response) => {
    try {
        await PushSubscription.deleteOne({
            userId: req.userId,
            endpoint: req.body.endpoint
        });
        res.status(200).json({ message: 'Subscription removed successfully' });
    } catch (error) {
        console.error('Error removing push subscription:', error);
        res.status(500).json({ error: 'Error removing subscription' });
    }
};

export const sendPushNotification = async (
    userId: string,
    title: string,
    options: webpush.NotificationOptions = {}
) => {
    try {
        const subscriptions = await PushSubscription.find({ userId });

        const notifications = subscriptions.map(async (subscription) => {
            try {
                await webpush.sendNotification(
                    {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription.keys.p256dh,
                            auth: subscription.keys.auth
                        }
                    },
                    JSON.stringify({
                        title,
                        ...options
                    })
                );
            } catch (error) {
                console.error('Error sending push notification:', error);
                // Si l'erreur est due à une souscription expirée, on la supprime
                if ((error as any).statusCode === 410) {
                    await PushSubscription.deleteOne({ _id: subscription._id });
                }
            }
        });

        await Promise.all(notifications);
        return true;
    } catch (error) {
        console.error('Error in sendPushNotification:', error);
        return false;
    }
}; 
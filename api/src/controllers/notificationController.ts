import { Request, Response } from 'express';
import Notification from '../models/Notification';

interface AuthRequest extends Request {
  userId?: string;
}

export const createNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notification = new Notification({ ...req.body, userId: req.userId });
    await notification.save();
    res.status(201).send(notification);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.userId });
    if (!notification) {
      return res.status(404).send();
    }
    res.send(notification);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true, runValidators: true });
    if (!notification) {
      return res.status(404).send();
    }
    res.send(notification);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!notification) {
      return res.status(404).send();
    }
    res.send(notification);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAllNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ userId: req.userId });
    res.send(notifications);
  } catch (error) {
    res.status(500).send(error);
  }
};
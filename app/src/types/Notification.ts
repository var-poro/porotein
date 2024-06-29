export interface Notification {
  _id: string;
  userId: string;
  message: string;
  date: Date;
  isRead: boolean;
}

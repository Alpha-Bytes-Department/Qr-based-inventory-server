import { JwtPayload } from 'jsonwebtoken';
import { Notification } from './Notification.model';

const getNotificationToDb = async (user: JwtPayload) => {
  const result = await Notification.find({
    $or: [{ receiver: user.id }, { type: 'USER' }],
  })
    .populate({
      path: 'product',
      select: 'name image price',
    })
    .sort({ createdAt: -1 });

  const unredCount = await Notification.countDocuments({
    $or: [{ receiver: user.id }, { type: 'USER' }],
    read: false,
  });

  return {
    result,
    unredCount,
  };
};
const readNotification = async (user: JwtPayload) => {
  const result = await Notification.updateMany(
    { receiver: user.id },
    { read: true }
  );
  return result;
};

const adminNotification = async (query: Record<string, unknown>) => {
  const { page, limit } = query;

  // Apply filter conditions

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Set default sort order to show new data first

  const result = await Notification.find({ type: 'ADMIN' })

    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await Notification.countDocuments({ type: 'ADMIN' });
  const unread = await Notification.countDocuments({
    type: 'ADMIN',
    read: false,
  });

  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
      unread,
    },
  };
  return data;
};

const adminReadNotification = async () => {
  const result = await Notification.updateMany(
    { type: 'ADMIN' },
    { read: true }
  );
  return result;
};

const deleteAllNotifications = async () => {
  const result = await Notification.deleteMany({ type: 'ADMIN' });
  return result;
};

export const NotificationService = {
  getNotificationToDb,
  readNotification,
  adminNotification,
  adminReadNotification,
  deleteAllNotifications,
};

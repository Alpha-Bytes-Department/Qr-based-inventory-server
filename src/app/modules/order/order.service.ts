import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { Product } from '../product/product.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (orderData: IOrder) => {
  const order = await Order.create(orderData);

  const products = order.items.map(item => ({
    productId: item.productId,
  }));

  for (const product of products) {
    await Product.findOne({ _id: product.productId });

    const isExist = await Product.findOne({ _id: product.productId });

    await sendNotifications({
      text: `Your order has been placed successfully.`,
      receiver: order.user,
      product: product.productId,
    });

    if (!isExist) {
      throw new Error(`Product does not exist.`);
    }
  }

  return order;
};

const acceptOrder = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  const updatedOrder: any = await Order.findOneAndUpdate(
    { _id: orderId },
    { status: 'delivered' },
    { new: true }
  );

  if (updatedOrder.status === 'delivered') {
    await sendNotifications({
      text: `Your order has been delivered successfully.`,
      receiver: updatedOrder.user,
    });
  }

  return updatedOrder;
};

const getAllOrder = async (query: Record<string, unknown>) => {
  const { searchTerm, name, page = '1', limit = '10', ...filters } = query;

  const conditions: any[] = [];

  // Additional filters
  if (Object.keys(filters).length) {
    conditions.push({
      $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
    });
  }

  const where = conditions.length ? { $and: conditions } : {};

  // Pagination
  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * pageSize;

  // Fetch products with category populated
  const [order, total] = await Promise.all([
    Order.find(where)
      .populate({
        path: 'items.productId',
        model: 'Product',
        select: 'name image size',
      })
      .populate({
        path: 'user',
        select: 'name email',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Order.countDocuments(where),
  ]);

  return {
    result: order,
    meta: {
      page: pageNumber,
      total,
    },
  };
};
export const OrderService = {
  createOrder,
  acceptOrder,
  getAllOrder,
};

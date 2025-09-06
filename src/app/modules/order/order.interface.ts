import { Types } from 'mongoose';

export type IOrder = {
  user: Types.ObjectId;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'delivered';
};

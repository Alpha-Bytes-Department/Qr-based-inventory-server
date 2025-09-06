import { Types } from 'mongoose';

export type IProduct = {
  name: string;
  image: string;
  price: string;
  category: Types.ObjectId;
  rating?: number;
  count?: number;
  size?: string;
  status: 'active' | 'deleted';
};

import { Types } from 'mongoose';

export type IAssignProduct = {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
};

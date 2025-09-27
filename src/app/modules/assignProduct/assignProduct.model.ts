import { model, Schema } from 'mongoose';
import { IAssignProduct } from './assignProduct.interface';

const assignProductSchema = new Schema<IAssignProduct>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const AssignProduct = model<IAssignProduct>(
  'AssignProduct',
  assignProductSchema
);

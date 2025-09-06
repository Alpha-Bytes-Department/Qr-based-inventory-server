import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
    },
    count: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>('Product', productSchema);

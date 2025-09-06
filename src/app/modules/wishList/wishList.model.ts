import { model, Schema } from 'mongoose';
import { IWishList } from './wishList.interface';

const wishListSchema = new Schema<IWishList>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const WishList = model<IWishList>('WishList', wishListSchema);

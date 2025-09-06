import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Review } from './review.model';

import { Product } from '../product/product.model';
import { IReview } from './review.interface';

const createReviewToDB = async (payload: Partial<IReview>) => {
  const isExistProduct = await Product.findById(payload.product);
  if (!isExistProduct) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  const result = await Review.create(payload);

  if (!result) {
    return 'Review not created!';
  }

  const reviews = await Review.find({ product: payload.product });

  const totalRatings = reviews.reduce(
    (sum, review) => sum + (review.rating || 0),
    0
  );
  const reviewCount = reviews.length;
  const averageRating = Math.round(totalRatings / reviewCount);

  await Product.updateOne(
    { _id: payload.product },
    {
      $set: {
        rating: averageRating,
        count: reviewCount,
      },
    }
  );

  return result;
};

export const ReviewService = {
  createReviewToDB,
};

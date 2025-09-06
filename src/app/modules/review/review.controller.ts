import catchAsync from '../../../shared/catchAsync';
import { ReviewService } from './review.service';

const createReviewToDB = catchAsync(async (req, res) => {
  const user = req.user.id;

  const value = {
    ...req.body,
    user: user,
  };

  const result = await ReviewService.createReviewToDB(value);
  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

export const ReviewController = {
  createReviewToDB,
};

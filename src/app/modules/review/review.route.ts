import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { ReviewController } from './review.controller';

const router = express.Router();

router.post(
  '/create-review',
  auth(USER_ROLES.USER),
  ReviewController.createReviewToDB
);

router.get(
  '/get-all-review/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  ReviewController.getAllReview
);

export const ReviewRoutes = router;

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

export const ReviewRoutes = router;

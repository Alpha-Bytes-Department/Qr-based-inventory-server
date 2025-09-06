import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { PersonalizationController } from './personalization.controller';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER),
  PersonalizationController.createPersonalization
);

export const PersonalizationRoutes = router;

import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

router.get(
  '/get-all-data',
  auth(USER_ROLES.ADMIN),
  DashboardController.getAllDashboardData
);

router.get(
  '/get-earning-chart-data',
  auth(USER_ROLES.ADMIN),
  DashboardController.getEarningChartData
);

export const DashboardRoutes = router;

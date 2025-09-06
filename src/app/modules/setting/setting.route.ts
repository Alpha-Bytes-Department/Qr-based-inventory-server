import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { SettingController } from './setting.controller';

const router = express.Router();

router.patch(
  '/update/:type',
  auth(USER_ROLES.ADMIN),
  SettingController.createSetting
);

router.get('/get/:type', SettingController.getSetting);

export const SettingRoutes = router;

import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { AssignProductController } from './assignProduct.controller';

const router = express.Router();

router.post(
  '/assign',
  auth(USER_ROLES.ADMIN),
  AssignProductController.assignProduct
);

router.get(
  '/get-all-assign-product',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  AssignProductController.getAllAssignProduct
);

export const AssignProductRoutes = router;

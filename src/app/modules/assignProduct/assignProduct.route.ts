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

router.get(
  '/get-all-assign-product-by-category/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  AssignProductController.getAllAssignProductByCategory
);

router.get(
  '/get-all-data',
  auth(USER_ROLES.ADMIN),
  AssignProductController.getAllDataFromDb
);

router.delete(
  '/delete-assign-product/:id',
  auth(USER_ROLES.ADMIN),
  AssignProductController.deleteAssignData
);

export const AssignProductRoutes = router;

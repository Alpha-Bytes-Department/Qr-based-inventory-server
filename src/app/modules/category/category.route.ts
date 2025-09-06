import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { CategoryValidation } from './category.validation';
import { CategoryController } from './category.controller';

const router = express.Router();

router.post(
  '/create',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = CategoryValidation.createCategoryZodSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return CategoryController.createCategory(req, res, next);
  }
);

router.patch(
  '/update/:id',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = CategoryValidation.updateCategoryZodSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return CategoryController.updateCategory(req, res, next);
  }
);

router.get(
  '/get-all',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  CategoryController.getAllCategories
);

router.get(
  '/get-details/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  CategoryController.getDetails
);

export const CategoryRoute = router;

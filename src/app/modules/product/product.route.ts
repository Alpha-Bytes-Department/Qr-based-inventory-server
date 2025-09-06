import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { ProductValidation } from './product.validation';
import { ProductController } from './product.controller';

const router = express.Router();

router.post(
  '/create',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = ProductValidation.createProductZodSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return ProductController.createProduct(req, res, next);
  }
);

router.patch(
  '/update/:id',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = ProductValidation.updateProductSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return ProductController.updateProduct(req, res, next);
  }
);

router.get(
  '/get-all-products',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  ProductController.getAllProducts
);

router.get(
  '/get-details/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  ProductController.productDetails
);

router.delete(
  '/delete/:id',
  auth(USER_ROLES.ADMIN),
  ProductController.deleteProduct
);

router.get(
  '/get-all-products-admin',
  auth(USER_ROLES.ADMIN),
  ProductController.getAllProductAdmin
);

export const ProductRoutes = router;

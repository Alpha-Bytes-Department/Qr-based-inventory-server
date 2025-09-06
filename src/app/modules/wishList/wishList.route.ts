import express from 'express';
import { WishListController } from './wishList.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/add-to-wishlist/:id',
  auth(USER_ROLES.USER),
  WishListController.createWishList
);

router.delete(
  '/remove-from-wishlist/:id',
  auth(USER_ROLES.USER),
  WishListController.removeWishList
);

router.get(
  '/get-all-wishlists',
  auth(USER_ROLES.USER),
  WishListController.getAllWishLists
);

router.get(
  '/get-details-wishlist/:id',
  auth(USER_ROLES.USER),
  WishListController.getDetailsWishList
);

export const WishListRoutes = router;

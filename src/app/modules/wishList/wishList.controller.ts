import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WishListService } from './wishList.service';

const createWishList = catchAsync(async (req, res) => {
  const user = req.user.id;
  const product = req.params.id;

  const value: any = {
    user,
    product,
  };
  const result = await WishListService.createWishList(value);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Wish List created successfully',
    data: result,
  });
});

const removeWishList = catchAsync(async (req, res) => {
  const user = req.user.id;
  const product = req.params.id;

  const value: any = {
    user,
    product,
  };

  const result = await WishListService.removeWishList(value);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Wish List deleted successfully',
    data: result,
  });
});

const getAllWishLists = catchAsync(async (req, res) => {
  const user = req.user.id;

  const result = await WishListService.getAllWishLists(user, req.query);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Wish List retrieved successfully',
    data: result,
  });
});

const getDetailsWishList = catchAsync(async (req, res) => {
  const result = await WishListService.getDetailsWishList(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Wish List retrieved successfully',
    data: result,
  });
});

export const WishListController = {
  createWishList,
  removeWishList,
  getAllWishLists,
  getDetailsWishList,
};

import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const user = req.user.id;

  const orderData = {
    ...req.body,
    user,
  };

  const result = await OrderService.createOrder(orderData);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const acceptOrder = catchAsync(async (req, res) => {
  const result = await OrderService.acceptOrder(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order accepted successfully',
    data: result,
  });
});

const getAllOrder = catchAsync(async (req, res) => {
  const result = await OrderService.getAllOrder(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  acceptOrder,
  getAllOrder,
};

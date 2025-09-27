import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AssignProductService } from './assignProduct.service';

const assignProduct = catchAsync(async (req, res) => {
  const result = await AssignProductService.assignProduct(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product assigned successfully',
    data: result,
  });
});

export const AssignProductController = { assignProduct };

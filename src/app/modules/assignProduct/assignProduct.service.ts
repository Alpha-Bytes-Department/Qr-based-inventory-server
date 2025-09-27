import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IAssignProduct } from './assignProduct.interface';
import { AssignProduct } from './assignProduct.model';

const assignProduct = async (data: IAssignProduct) => {
  const isExist = await AssignProduct.findOne({
    productId: data.productId,
    userId: data.userId,
  });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product already assigned');
  }

  const result = await AssignProduct.create(data);
  return result;
};

export const AssignProductService = { assignProduct };

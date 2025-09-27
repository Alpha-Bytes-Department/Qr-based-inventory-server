import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IAssignProduct } from './assignProduct.interface';
import { AssignProduct } from './assignProduct.model';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';

const assignProduct = async (data: IAssignProduct) => {
  const [user, product, existingAssignment] = await Promise.all([
    User.findById(data.userId),
    Product.findById(data.productId),
    AssignProduct.findOne({ productId: data.productId, userId: data.userId }),
  ]);

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }
  if (!product) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not found');
  }
  if (existingAssignment) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product already assigned');
  }

  return AssignProduct.create(data);
};

const getAllAssignProduct = async (query: Record<string, unknown>) => {
  const { searchTerm, name, page = '1', limit = '10', ...filters } = query;

  const conditions: any[] = [];

  // Search by category name
  if (searchTerm) {
    const productIds = await Product.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).distinct('_id');

    if (productIds.length) {
      conditions.push({ productId: { $in: productIds } });
    }
  }

  // Additional filters
  if (Object.keys(filters).length) {
    conditions.push({
      $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
    });
  }

  const where = conditions.length ? { $and: conditions } : {};

  // Pagination
  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * pageSize;

  // Fetch products with category populated
  const [assignProduct, total] = await Promise.all([
    AssignProduct.find(where)
      .populate({
        path: 'productId',
        model: 'Product',
        select: 'name image size price',
      })
      .populate({
        path: 'userId',
        model: 'User',
        select: 'name email',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    AssignProduct.countDocuments(where),
  ]);

  return {
    assignProduct,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export const AssignProductService = { assignProduct, getAllAssignProduct };

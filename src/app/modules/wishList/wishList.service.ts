import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Product } from '../product/product.model';
import { IWishList } from './wishList.interface';
import { WishList } from './wishList.model';

const createWishList = async (data: IWishList): Promise<IWishList> => {
  const [product, existingWish] = await Promise.all([
    Product.findById(data.product),
    WishList.findOne({ user: data.user, product: data.product }),
  ]);

  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  if (existingWish) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product already in wishlist');
  }

  return WishList.create(data);
};

const removeWishList = async (data: IWishList): Promise<IWishList | null> => {
  const wishListItem = await WishList.findOneAndDelete({
    user: data.user,
    product: data.product,
  });

  if (!wishListItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Wish List item not found');
  }

  return wishListItem;
};

const getAllWishLists = async (
  user: string,
  query: Record<string, unknown>
) => {
  const { searchTerm, page = '1', limit = '10', ...filters } = query;

  const conditions: any[] = [];

  // Search by category name
  if (searchTerm) {
    const productIds = await Product.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).distinct('_id');

    if (productIds.length) {
      conditions.push({ product: { $in: productIds } });
    }
  }

  conditions.push({ user: user });

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
  const [products, total] = await Promise.all([
    WishList.find(where)
      .populate({ path: 'product', select: 'name' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    WishList.countDocuments(where),
  ]);

  return {
    result: products,
    meta: {
      page: pageNumber,
      total,
    },
  };
};

const getDetailsWishList = async (id: string): Promise<IWishList | null> => {
  const wishListItem = await WishList.findById(id).populate({
    path: 'product',
  });
  if (!wishListItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Wish List item not found');
  }
  return wishListItem;
};

export const WishListService = {
  createWishList,
  removeWishList,
  getAllWishLists,
  getDetailsWishList,
};

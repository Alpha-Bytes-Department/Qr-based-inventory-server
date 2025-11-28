import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IAssignProduct } from './assignProduct.interface';
import { AssignProduct } from './assignProduct.model';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
import { Category } from '../category/category.model';

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
  const {
    categoryName,
    searchTerm,
    page = '1',
    limit = '10',
    ...filters
  } = query;

  const conditions: any[] = [];

  // ✅ Search by product name (only non-deleted products)
  if (searchTerm) {
    const productIds = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { price: { $regex: searchTerm, $options: 'i' } },
      ],
      status: { $ne: 'deleted' },
    }).distinct('_id');

    if (productIds.length) {
      conditions.push({ productId: { $in: productIds } });
    }
  }

  if (categoryName) {
    // 🔎 Step 1: Find categories that match the search term
    const categoryIds = await Category.find({
      name: { $regex: categoryName, $options: 'i' },
    }).distinct('_id');

    // 🔎 Step 2: Find products that either match by name or belong to those categories
    const products = await Product.find({
      $or: [
        { name: { $regex: categoryName, $options: 'i' } },
        { price: { $regex: categoryName, $options: 'i' } },
        { category: { $in: categoryIds } },
      ],
      status: { $ne: 'deleted' },
    }).distinct('_id');

    // 🔎 Step 3: Push productIds to conditions
    if (products.length) {
      conditions.push({ productId: { $in: products } });
    }
  }

  // ✅ Additional filters (like userId, status, etc.)
  if (Object.keys(filters).length) {
    conditions.push({
      $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
    });
  }

  const where = conditions.length ? { $and: conditions } : {};

  // ✅ Pagination
  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * pageSize;

  // ✅ Query AssignProduct with populated product (excluding deleted)
  const [assignProduct, total] = await Promise.all([
    AssignProduct.find(where)
      .populate({
        path: 'productId',
        model: 'Product',
        match: { status: { $ne: 'deleted' } }, // ⬅️ filter out deleted products
        select: 'name image size price status qrId count rating',
      })
      .populate({
        path: 'userId',
        model: 'User',
        select: 'name email image',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    AssignProduct.countDocuments(where),
  ]);

  // ✅ Remove assignProducts where productId got filtered out
  const filteredAssignProduct = assignProduct.filter(
    item => item.productId !== null
  );

  return {
    assignProduct: filteredAssignProduct,
    meta: {
      page: pageNumber,
      limit: pageSize,
      total,
    },
  };
};

const getAllAssignProductByCategory = async (
  categoryId: string,
  query: Record<string, unknown>
) => {
  const { searchTerm, page = '1', limit = '10', ...filters } = query;

  const conditions: any[] = [];

  // ✅ Find productIds by category
  const productIdsByCategory = await Product.find({
    category: categoryId,
    status: { $ne: 'deleted' },
  }).distinct('_id');

  if (!productIdsByCategory.length) {
    return {
      assignProduct: [],
      meta: { page, limit, total: 0 },
    };
  }

  conditions.push({ productId: { $in: productIdsByCategory } });

  // ✅ Search by product name
  if (searchTerm) {
    const productIds = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { price: { $regex: searchTerm, $options: 'i' } },
      ],
      category: categoryId,
    }).distinct('_id');

    if (productIds.length) {
      conditions.push({ productId: { $in: productIds } });
    }
  }

  // ✅ Extra filters (like userId, status etc.)
  if (Object.keys(filters).length) {
    conditions.push({
      $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
    });
  }

  const where = conditions.length ? { $and: conditions } : {};

  // ✅ Pagination
  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * pageSize;

  // ✅ Query AssignProduct with populated fields
  const [assignProduct, total] = await Promise.all([
    AssignProduct.find(where)
      .populate({
        path: 'productId',
        model: 'Product',
        select: 'name image size price category qrId count rating',
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
      page: pageNumber,
      limit: pageSize,
      total,
    },
  };
};

const getAllDataFromDb = async (query: Record<string, unknown>) => {
  const { searchTerm, page = '1', limit = '10', ...filters } = query;

  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { price: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

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

  // Query AssignProduct with populated fields
  const [assignProduct, total] = await Promise.all([
    AssignProduct.find(where)
      .populate({
        path: 'productId',
        model: 'Product',
        select: 'name image size price category qrId count rating',
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
      page: pageNumber,
      limit: pageSize,
      total,
    },
  };
};

const deleteAssignData = async (id: string) => {
  const isExist = await AssignProduct.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'AssignProduct not found');
  }

  return AssignProduct.findByIdAndDelete(id);
};

export const AssignProductService = {
  assignProduct,
  getAllAssignProduct,
  getAllAssignProductByCategory,
  getAllDataFromDb,
  deleteAssignData,
};

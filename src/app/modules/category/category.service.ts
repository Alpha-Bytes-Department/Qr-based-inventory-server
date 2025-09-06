import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICategory } from './category.interface';
import { Category } from './category.model';
import unlinkFile from '../../../shared/unlinkFile';

const createCategory = async (categoryData: ICategory) => {
  const isExist: any = await Category.findOne({ name: categoryData.name });
  if (isExist) {
    await unlinkFile(isExist.image);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category already exists');
  }

  const result = await Category.create(categoryData);
  return result;
};

const updateCategory = async (id: string, categoryData: ICategory) => {
  const existingCategory = await Category.findById(id);
  if (!existingCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category not found');
  }

  if (existingCategory.image && categoryData.image) {
    await unlinkFile(existingCategory.image);
  }

  const result = await Category.findByIdAndUpdate(id, categoryData, {
    new: true,
  });
  return result;
};

const getAllCategories = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const anyConditions: any[] = [];

  if (searchTerm) {
    anyConditions.push({
      $or: [{ name: { $regex: searchTerm, $options: 'i' } }],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Category.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Category.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const getDetails = async (id: string) => {
  const existingCategory = await Category.findById(id);
  if (!existingCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category not found');
  }
  return existingCategory;
};

export const CategoryService = {
  createCategory,
  updateCategory,
  getAllCategories,
  getDetails,
};

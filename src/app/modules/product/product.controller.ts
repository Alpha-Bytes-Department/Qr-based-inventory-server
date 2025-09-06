import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getFilePathMultiple } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './product.service';

const createProduct = catchAsync(async (req, res) => {
  const value = { ...req.body };

  const image = getFilePathMultiple(req.files, 'image', 'image');

  if (image?.length) value.image = image[0];

  const result = await ProductService.createProduct(value);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const value = { ...req.body };

  const image = getFilePathMultiple(req.files, 'image', 'image');

  if (image?.length) value.image = image[0];

  const result = await ProductService.updateProduct(req.params.id, value);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProducts(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const productDetails = catchAsync(async (req, res) => {
  const result = await ProductService.productDetails(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const result = await ProductService.deleteProduct(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

const getAllProductAdmin = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProductAdmin(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  updateProduct,
  getAllProducts,
  productDetails,
  deleteProduct,
  getAllProductAdmin,
};

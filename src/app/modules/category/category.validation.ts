import z from 'zod';

const createCategoryZodSchema = z.object({
  name: z.string().nonempty('Category name is required'),
});

const updateCategoryZodSchema = z.object({
  name: z.string().optional(),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};

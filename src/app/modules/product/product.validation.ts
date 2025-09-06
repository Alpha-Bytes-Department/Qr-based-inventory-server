import z from 'zod';

// Base product schema (create)
const createProductZodSchema = z.object({
  name: z.string().nonempty('name is required'),
  price: z.string().nonempty('price is required'),
  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId' }),
  rating: z.string().optional(),
  size: z.string().optional(),
});

// Partial for updates (all fields optional)
const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.string().min(1).optional(),
  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId' })
    .optional(),
  rating: z.string().optional(),
  size: z.string().optional(),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductSchema,
};

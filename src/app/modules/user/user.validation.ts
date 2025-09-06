import { z } from 'zod';

const createUserZodSchema = z.object({
  name: z.string().optional(),
  email: z.string().nonempty('Email is required'),
  phone: z.string().nonempty('Phone is required'),
  password: z.string().nonempty('Password is required'),
});

const updateZodSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
});

export const UserValidation = {
  createUserZodSchema,
  updateZodSchema,
};

import { z } from 'zod';

export const createShippingSchema = z.object({
  address: z.string(),
  zipCode: z.string(),
  city: z.string(),
  country: z.string(),
  customerId: z.string().uuid(),
});

export const updateShippingSchema = z.object({
  id: z.string().uuid(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  customerId: z.string().uuid().optional(),
});

export const filterShippingSchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  customerId: z.string().uuid().optional(),
});

export type TCreateShippingSchema = z.infer<typeof createShippingSchema>;
export type TUpdateShippingSchema = z.infer<typeof updateShippingSchema>;
export type TFilterShippingSchema = z.infer<typeof filterShippingSchema>;

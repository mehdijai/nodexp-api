import { CustomerStatus, CustomerType, Genders } from '@/types/enums';
import { z } from 'zod';

export const createCustomerSchema = z.object({
  type: z.nativeEnum(CustomerType),
  gender: z.nativeEnum(Genders),
  firstname: z.string(),
  lastname: z.string(),
  phone: z.string(),
  email: z.string().email(),
  adresse: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  companyId: z.string().uuid().optional(),
  statut: z.nativeEnum(CustomerStatus).optional(),
});

export const updateCustomerSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(CustomerType).optional(),
  gender: z.nativeEnum(Genders).optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  adresse: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  companyId: z.string().uuid().optional(),
  statut: z.nativeEnum(CustomerStatus).optional(),
});

export const filterCustomerSchema = z.object({
  query: z.string().optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  type: z.nativeEnum(CustomerType).optional(),
  gender: z.nativeEnum(Genders).optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  companyId: z.string().uuid().optional(),
  statut: z.nativeEnum(CustomerStatus).optional(),
});

export type TCreateCustomerSchema = z.infer<typeof createCustomerSchema>;
export type TUpdateCustomerSchema = z.infer<typeof updateCustomerSchema>;
export type TFilterCustomerSchema = z.infer<typeof filterCustomerSchema>;

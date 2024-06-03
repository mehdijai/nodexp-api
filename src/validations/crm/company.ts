import { CompanyLegalStatus, CompanyStatus } from '@/types/enums';
import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string(),
  address: z.string(),
  zipCode: z.string(),
  city: z.string(),
  country: z.string(),
  phone: z.string(),
  email: z.string().email(),
  status: z.nativeEnum(CompanyStatus),
  rc: z.string(),
  legalStatus: z.nativeEnum(CompanyLegalStatus),
  ice: z.string(),
});

export const updateCompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  status: z.nativeEnum(CompanyStatus).optional(),
  rc: z.string().optional(),
  legalStatus: z.nativeEnum(CompanyLegalStatus).optional(),
  ice: z.string().optional(),
});

export const filterCompanySchema = z.object({
  query: z.string().optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  status: z.nativeEnum(CompanyStatus).optional(),
  rc: z.string().optional(),
  legalStatus: z.nativeEnum(CompanyLegalStatus).optional(),
  ice: z.string().optional(),
});

export type TCreateCompanySchema = z.infer<typeof createCompanySchema>;
export type TUpdateCompanySchema = z.infer<typeof updateCompanySchema>;
export type TFilterCompanySchema = z.infer<typeof filterCompanySchema>;

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import {
  CompanyStatus,
  CompanyLegalStatus,
  CustomerType,
  Genders,
  CustomerStatus,
} from '../../src/types/enums';
const prisma = new PrismaClient();

export async function seedCustomers(creatorId: string) {
  const company = await prisma.company.create({
    data: {
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      zipCode: faker.location.zipCode(),
      city: faker.location.city(),
      country: faker.location.country(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      status: CompanyStatus.ACTIVE,
      legalStatus: CompanyLegalStatus.SARL,
      rc: faker.number.int().toString(),
      ice: faker.number.int().toString(),
      creator: {
        connect: {
          id: creatorId,
        },
      },
    },
  });
  const customersData = Array.from({ length: 10 }, function () {
    return {
      type: faker.helpers.enumValue(CustomerType),
      gender: faker.helpers.enumValue(Genders),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      adresse: faker.location.streetAddress(),
      zipCode: faker.location.zipCode(),
      city: faker.location.city(),
      country: faker.location.country(),
      statut: CustomerStatus.ACTIVE,
      creatorId,
      companyId: company.id,
    };
  });

  await prisma.customer.createMany({
    data: customersData,
  });
}

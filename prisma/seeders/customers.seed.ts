import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function seedCustomers() {
  const status = ['Active', 'Inactive', 'Encours'];
  const type = ['Particulier', 'Entreprise'];
  const fj = ['SARL', 'SARL AU', 'SA'];

  const customersData = Array.from({ length: 10 }, () => ({
    number: faker.number.int({ min: 1000, max: 9999 }).toString(),
    type: faker.helpers.arrayElement(type),
    gender: 'M.',
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    company_name: faker.company.name(),
    company_fj: faker.helpers.arrayElement(fj),
    company_ice: faker.number.int({ min: 1111111111, max: 9999999999 }).toString(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    adresse: faker.location.streetAddress(),
    postal_code: '20000',
    city: 'Casablanca',
    country: 'Maroc',
    adresse_shipping: faker.location.streetAddress(),
    postal_code_shipping: '20000',
    city_shipping: 'Casablanca',
    country_shipping: 'Maroc',
    statut: faker.helpers.arrayElement(status),
    created_by: 'Admin',
  }));

  await prisma.customer.createMany({
    data: customersData,
  });
}

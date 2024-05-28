import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seedCustomers() {
  const status = ['Active', 'Inactive', 'Encours'];
  const type = [['Particulier', 'Entreprise']];
  const fj = ['SARL', 'SARL AU', 'SA'];

  const customersData = Array.from({ length: 10 }, () => ({
    number: faker.unique(faker.random.number({ min: 1000, max: 9999 })),
    type: 'ss',
    gender: 'M.',
    firstname: faker.unique(faker.name.firstName),
    lastname: faker.unique(faker.name.lastName),
    company_name: faker.unique(faker.company.companyName),
    company_fj: faker.random.arrayElements(fj),
    company_ice: faker.random.number({ min: 1111111111, max: 9999999999 }).toString(),
    phone: faker.phone.phoneNumber(),
    email: faker.internet.email,
    adresse: faker.address.streetAddress(),
    postal_code: '20000',
    city: 'Casablanca',
    country: 'Maroc',
    adresse_shipping: faker.address.streetAddress(),
    postal_code_shipping: '20000',
    city_shipping: 'Casablanca',
    country_shipping: 'Maroc',
    statut: 'ss',
    created_by: 'Admin',
  }));

  await prisma.customer.createMany({
    data: customersData,
  });
}

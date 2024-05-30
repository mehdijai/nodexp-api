import { PrismaClient } from '@prisma/client';
import { seedCustomers } from './seeders/customers.seed';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    const role = await prisma.role.create({
      data: { name: 'administrator' },
    });

    const abilities = ['read', 'write', 'create', 'edit', 'validate'];

    const permissionsData = abilities.flatMap((ability) => [
      { name: `${ability} user management`, roleId: role.id },
    ]);

    for (const permission of permissionsData) {
      await prisma.permission.create({
        data: permission,
      });
    }

    await prisma.user.create({
      data: {
        roleId: role.id,
        modelType: 'Web',
        hasMobileAccess: false,
        gender: 'man',
        firstname: 'Admin',
        lastname: 'Admin',
        email: 'admin@admin.com',
        password: await bcrypt.hash('51243687', 10),
        emailVerifiedAt: new Date(),
        phone: '0666112233',
      },
    });

    await seedCustomers();
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error inserting seed data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(async (error) => {
  await prisma.$disconnect();
  console.error('Error in seed script:', error);
  process.exit(1);
});

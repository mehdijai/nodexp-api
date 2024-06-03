import { PrismaClient } from '@prisma/client';
import { seedCustomers } from './seeders/customers.seed';
import bcrypt from 'bcryptjs';
import { roleAndPermissionsSeeder } from './seeders/roleAndPermissionsSeeder';

const prisma = new PrismaClient();

async function main() {
  try {
    const roleId = await roleAndPermissionsSeeder(prisma);

    const adminUser = await prisma.user.create({
      data: {
        roleId: roleId,
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

    await seedCustomers(adminUser.id);
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

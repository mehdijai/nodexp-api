import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/user.seed';
import { seedRoles } from './seeders/roles.seed';
import { seedPermissions } from './seeders/permissions.seed';
import { assignUserRole } from './seeders/user-assignment.seed';
import { seedRolePermissions } from './seeders/role-permissions-assignment.seed';

const prisma = new PrismaClient();

async function main() {
  try {
    await seedRoles();
    await seedPermissions();
    await seedRolePermissions();
    await seedUsers();
    await assignUserRole();
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error inserting seed data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Error in seed script:', error);
  process.exit(1);
});

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRoles() {
  const rolesData = [
    { name: 'administrator' },
    // Add more roles as needed
  ];

  for (const role of rolesData) {
    await prisma.role.create({
      data: role,
    });
  }
}

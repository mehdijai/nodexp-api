import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPermissions() {
  const abilities = ['read', 'write', 'create', 'edit', 'validate'];

  const permissionsData = abilities.flatMap((ability) => [
    { name: `${ability} user management` },
    // Add more permissions as needed
  ]);

  for (const permission of permissionsData) {
    await prisma.permission.create({
      data: permission,
    });
  }
}

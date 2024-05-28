import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function assignUserRole() {
  const userId = 1;
  const roleId = 1;

  await prisma.userRole.create({
    data: {
      userId,
      roleId,
    },
  });
}

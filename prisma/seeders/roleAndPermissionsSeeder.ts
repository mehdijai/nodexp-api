import { PrismaClient } from '@prisma/client';

export async function roleAndPermissionsSeeder(prisma: PrismaClient) {
  const adminRole = await prisma.role.create({
    data: { name: 'administrator' },
  });

  const abilities = ['read', 'write', 'create', 'edit', 'validate'];

  const adminPermissionsData = abilities.flatMap((ability) => [
    { name: `${ability}_user`, roleId: adminRole.id },
  ]);

  for (const permission of adminPermissionsData) {
    await prisma.permission.create({
      data: permission,
    });
  }
  const crmManagerRole = await prisma.role.create({
    data: { name: 'crm-manager' },
  });

  const crmAdminPermissionsData = abilities.flatMap((ability) => [
    { name: `${ability}_customer`, roleId: crmManagerRole.id },
  ]);

  for (const permission of crmAdminPermissionsData) {
    await prisma.permission.create({
      data: permission,
    });
  }

  return adminRole.id;
}

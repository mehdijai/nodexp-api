import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRolePermissions() {
  const rolePermissionsData = [
    { roleId: 1, permissionId: 1 },
    { roleId: 1, permissionId: 2 },
    { roleId: 1, permissionId: 3 },
    { roleId: 1, permissionId: 4 },
    { roleId: 1, permissionId: 5 },
  ];

  for (const data of rolePermissionsData) {
    await prisma.roleHasPermission.create({
      data,
    });
  }
}

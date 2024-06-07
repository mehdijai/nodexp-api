import { PrismaClient } from '@prisma/client';
import { Policies } from '../../src/services/policies.service';

export async function roleAndPermissionsSeeder(prisma: PrismaClient) {
  const adminRole = await prisma.role.create({
    data: { name: 'administrator' },
  });

  await Policies.createAllPolicy('user', [adminRole.id]);

  const crmManagerRole = await prisma.role.create({
    data: { name: 'crm-manager' },
  });

  await Policies.createAllPolicy('customer', [adminRole.id, crmManagerRole.id]);

  return adminRole.id;
}

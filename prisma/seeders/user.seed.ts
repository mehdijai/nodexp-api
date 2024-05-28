import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedUsers() {
  await prisma.user.create({
    data: {
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
}

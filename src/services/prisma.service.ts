import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient {
  async onModuleDestroy() {
    await this.$disconnect();
  }
}

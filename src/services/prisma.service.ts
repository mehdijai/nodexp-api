import { PrismaClient } from '@prisma/client';

export class PrismaService {
  static prismaInstance: PrismaClient;
  static getInstance() {
    if (!this.prismaInstance) {
      this.prismaInstance = new PrismaClient();
    }
    return this.prismaInstance;
  }
  static async onModuleDestroy() {
    await this.prismaInstance.$disconnect();
  }
}

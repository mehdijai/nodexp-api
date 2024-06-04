import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';

export default class ApiService {
  protected prisma: PrismaClient;
  constructor() {
    this.prisma = PrismaService.getInstance();
  }
}

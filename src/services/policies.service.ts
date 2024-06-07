import { PrismaService } from './prisma.service';

export enum PoliciesVerbs {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  REMOVE = 'remove',
  RESTORE = 'restore',
  READ = 'read',
  READ_ARCHIVED = 'read-archived',
  VALIDATE = 'validate',
}

export class Policies {
  private static prisma = PrismaService.getInstance();
  static async createAllPolicy(model: string, roleIds: string[]) {
    const keys = Object.values(PoliciesVerbs);
    for (const key of keys) {
      await this.prisma.permission.create({
        data: {
          name: `${key}_${model.toLowerCase()}`,
          roles: {
            connect: roleIds.map((id) => {
              return {
                id,
              };
            }),
          },
        },
      });
    }
  }
  static async createPolicy(model: string, verb: PoliciesVerbs, roleIds: string[]) {
    return await this.prisma.permission.create({
      data: {
        name: `${verb}_${model.toLowerCase()}`,
        roles: {
          connect: roleIds.map((id) => {
            return {
              id,
            };
          }),
        },
      },
    });
  }
  static async can(model: string, verb: PoliciesVerbs, roleId: string) {
    const existingPermission = await this.prisma.permission.findUnique({
      where: {
        name: `${verb}_${model.toLowerCase()}`,
        roles: {
          some: {
            id: roleId,
          },
        },
      },
    });

    return existingPermission !== null;
  }
}

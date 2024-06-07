import { Policies, PoliciesVerbs } from '@/services/policies.service';
import { PrismaService } from '@/services/prisma.service';
import { AuthenticatedRequest } from '@/types/auth.types';
import { ResponseHandler } from '@/utils/responseHandler';
import { NextFunction, Response } from 'express';

export function authorization(model: string, verb: PoliciesVerbs) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      ResponseHandler.setResponse(res).Unauthorized();
      return;
    }

    const prisma = PrismaService.getInstance();
    const authUser = await prisma.user.findUnique({
      where: {
        id: user.userId,
      },
      select: {
        roleId: true,
      },
    });

    if (!authUser) {
      ResponseHandler.setResponse(res).Forbidden();
      return;
    }

    const hasPermission = await Policies.can(model, verb, authUser.roleId);

    if (!hasPermission) {
      ResponseHandler.setResponse(res).Forbidden();
      return;
    }
    next();
  };
}

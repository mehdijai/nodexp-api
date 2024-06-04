import { CustomerStatus } from '@/types/enums';
import {
  TCreateCustomerSchema,
  TFilterCustomerSchema,
  TUpdateCustomerSchema,
} from '@/validations/crm/customer';
import ApiService from '../index.service';

export default class CustomerService extends ApiService {
  private _filterCustomer(filter: TFilterCustomerSchema, archived: boolean) {
    const wherePrisma: any = { deletedAt: archived === true ? { not: null } : null };
    if (filter.type) {
      wherePrisma.type = filter.type;
    }
    if (filter.gender) {
      wherePrisma.gender = filter.gender;
    }
    if (filter.zipCode) {
      wherePrisma.zipCode = filter.zipCode;
    }
    if (filter.city) {
      wherePrisma.city = filter.city;
    }
    if (filter.country) {
      wherePrisma.country = filter.country;
    }
    if (filter.companyId) {
      wherePrisma.companyId = filter.companyId;
    }
    if (filter.statut) {
      wherePrisma.statut = filter.statut;
    }
    if (filter.query) {
      wherePrisma.OR = [
        {
          firstname: {
            contains: filter.query,
          },
        },
        {
          lastname: {
            contains: filter.query,
          },
        },
        {
          phone: {
            contains: filter.query,
          },
        },
        {
          email: {
            contains: filter.query,
          },
        },
      ];
    }

    return wherePrisma;
  }
  async getCustomers({ take, skip, ...filter }: TFilterCustomerSchema, archived = false) {
    const wherePrisma = this._filterCustomer(filter, archived);
    return await this.prisma.customer.findMany({
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
      where: wherePrisma,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        company: true,
        shippingInfo: true,
        creator: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });
  }

  async getCustomer(id: string) {
    return await this.prisma.customer.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
        shippingInfo: true,
        creator: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });
  }

  async createCustomer(
    creatorId: string,
    { companyId, statut, ...payload }: TCreateCustomerSchema
  ) {
    return await this.prisma.customer.create({
      data: {
        ...payload,
        statut: statut ?? CustomerStatus.ACTIVE,
        companyId,
        creatorId,
      },
      include: {
        company: true,
        shippingInfo: true,
        creator: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });
  }

  async updateCustomer(payload: TUpdateCustomerSchema) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!customer) {
      return undefined;
    }

    return await this.prisma.customer.update({
      where: {
        id: payload.id,
      },
      data: {
        ...payload,
      },
      include: {
        company: true,
        shippingInfo: true,
        creator: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });
  }

  async removeCustomer(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: id,
      },
    });

    if (!customer) {
      return undefined;
    }

    return await this.prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restoreCustomer(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: id,
        deletedAt: { not: null },
      },
    });

    if (!customer) {
      return undefined;
    }

    return await this.prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: null,
      },
    });
  }

  async deleteCustomer(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: id,
      },
    });

    if (!customer) {
      return undefined;
    }

    return await this.prisma.customer.delete({
      where: {
        id: id,
      },
    });
  }
}

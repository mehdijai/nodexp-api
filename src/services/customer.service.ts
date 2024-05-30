import prisma from '@/utils/client';

export async function getCustomers() {
  return await prisma.customer.findMany();
}
export async function getCustomer(id: number) {
  return await prisma.customer.findUnique({
    where: {
      id,
    },
  });
}

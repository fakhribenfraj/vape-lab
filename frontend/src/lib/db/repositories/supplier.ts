import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface Supplier {
  id: string;
  storeId: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  leadTimeDays?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SupplierService {
  async create(data: {
    storeId: string;
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    leadTimeDays?: number;
    notes?: string;
  }): Promise<Supplier> {
    return prisma.supplier.create({
      data,
    }) as Promise<Supplier>;
  }

  async findById(id: string): Promise<Supplier | null> {
    return prisma.supplier.findUnique({
      where: { id },
      include: {
        purchaseOrders: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    }) as Promise<Supplier | null>;
  }

  async findByStore(storeId: string): Promise<Supplier[]> {
    return prisma.supplier.findMany({
      where: { storeId },
      orderBy: { name: "asc" },
    }) as Promise<Supplier[]>;
  }

  async findByNameAndStore(
    storeId: string,
    name: string,
  ): Promise<Supplier | null> {
    return prisma.supplier.findFirst({
      where: { storeId, name },
    }) as Promise<Supplier | null>;
  }

  async update(
    id: string,
    updates: Prisma.SupplierUpdateInput,
  ): Promise<Supplier> {
    return prisma.supplier.update({
      where: { id },
      data: updates,
    }) as Promise<Supplier>;
  }

  async delete(id: string): Promise<void> {
    await prisma.supplier.delete({
      where: { id },
    });
  }

  async search(
    storeId: string,
    query: string,
    limit: number = 10,
  ): Promise<Supplier[]> {
    return prisma.supplier.findMany({
      where: {
        storeId,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { contactName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { name: "asc" },
    }) as Promise<Supplier[]>;
  }

  async getSupplierCounts(storeId: string): Promise<{
    total: number;
    active: number;
  }> {
    const total = await prisma.supplier.count({
      where: { storeId },
    });

    const active = await prisma.supplier.count({
      where: {
        storeId,
        purchaseOrders: {
          some: {
            status: { in: ["ordered", "partial"] },
          },
        },
      },
    });

    return { total, active };
  }

  async getSuppliersWithActiveOrders(storeId: string): Promise<Supplier[]> {
    return prisma.supplier.findMany({
      where: {
        storeId,
        purchaseOrders: {
          some: {
            status: { in: ["ordered", "partial"] },
          },
        },
      },
      orderBy: { name: "asc" },
    }) as Promise<Supplier[]>;
  }
}

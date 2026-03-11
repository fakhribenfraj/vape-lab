import { prisma } from "@/lib/db";
import { Prisma, PurchaseOrderStatus } from "@prisma/client";

export interface PurchaseOrder {
  id: string;
  storeId: string;
  supplierId: string;
  orderNumber: string;
  status: PurchaseOrderStatus;
  expectedDate?: Date;
  receivedDate?: Date;
  totalCost: number;
  notes?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  rawMaterialId: string;
  quantity: number;
  unitCost: number;
  quantityReceived: number;
  createdAt: Date;
}

export class PurchaseOrderService {
  async create(data: {
    storeId: string;
    supplierId: string;
    orderNumber: string;
    expectedDate?: Date;
    notes?: string;
    createdBy?: string;
    items: {
      rawMaterialId: string;
      quantity: number;
      unitCost: number;
    }[];
  }): Promise<PurchaseOrder> {
    const totalCost = data.items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unitCost),
      0,
    );

    return prisma.purchaseOrder.create({
      data: {
        storeId: data.storeId,
        supplierId: data.supplierId,
        orderNumber: data.orderNumber,
        expectedDate: data.expectedDate,
        notes: data.notes,
        createdBy: data.createdBy,
        totalCost,
        items: {
          create: data.items.map((item) => ({
            rawMaterialId: item.rawMaterialId,
            quantity: item.quantity,
            unitCost: item.unitCost,
          })),
        },
      },
      include: {
        items: true,
        supplier: true,
      },
    }) as Promise<PurchaseOrder>;
  }

  async findById(id: string): Promise<PurchaseOrder | null> {
    return prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: {
          include: {
            rawMaterial: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    }) as Promise<PurchaseOrder | null>;
  }

  async findByStore(storeId: string): Promise<PurchaseOrder[]> {
    return prisma.purchaseOrder.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      include: {
        supplier: true,
      },
    }) as Promise<PurchaseOrder[]>;
  }

  async findBySupplier(supplierId: string): Promise<PurchaseOrder[]> {
    return prisma.purchaseOrder.findMany({
      where: { supplierId },
      orderBy: { createdAt: "desc" },
    }) as Promise<PurchaseOrder[]>;
  }

  async findByStatus(storeId: string, status: PurchaseOrderStatus): Promise<PurchaseOrder[]> {
    return prisma.purchaseOrder.findMany({
      where: { storeId, status },
      orderBy: { createdAt: "desc" },
      include: {
        supplier: true,
      },
    }) as Promise<PurchaseOrder[]>;
  }

  async update(
    id: string,
    updates: Prisma.PurchaseOrderUpdateInput,
  ): Promise<PurchaseOrder> {
    return prisma.purchaseOrder.update({
      where: { id },
      data: updates,
    }) as Promise<PurchaseOrder>;
  }

  async updateStatus(
    id: string,
    status: PurchaseOrderStatus,
  ): Promise<PurchaseOrder> {
    return prisma.purchaseOrder.update({
      where: { id },
      data: { status },
    }) as Promise<PurchaseOrder>;
  }

  async delete(id: string): Promise<void> {
    await prisma.purchaseOrder.delete({
      where: { id },
    });
  }

  async receive(
    id: string,
    receivedItems: {
      itemId: string;
      quantityReceived: number;
    }[],
  ): Promise<PurchaseOrder> {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new Error("Purchase order not found");
    }

    for (const item of receivedItems) {
      await prisma.purchaseOrderItem.update({
        where: { id: item.itemId },
        data: {
          quantityReceived: item.quantityReceived,
        },
      });
    }

    const updatedItems = await prisma.purchaseOrderItem.findMany({
      where: { purchaseOrderId: id },
    });

    const allFullyReceived = updatedItems.every(
      (item) => Number(item.quantityReceived) >= Number(item.quantity),
    );

    const anyPartiallyReceived = updatedItems.some(
      (item) => Number(item.quantityReceived) > 0 && Number(item.quantityReceived) < Number(item.quantity),
    );

    let newStatus: PurchaseOrderStatus = order.status;
    if (allFullyReceived) {
      newStatus = "received";
    } else if (anyPartiallyReceived) {
      newStatus = "partial";
    }

    const totalReceived = updatedItems.reduce(
      (sum, item) => sum + Number(item.quantityReceived) * Number(item.unitCost),
      0,
    );

    return prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: newStatus,
        receivedDate: allFullyReceived ? new Date() : undefined,
        totalCost: totalReceived,
      },
      include: {
        supplier: true,
        items: {
          include: {
            rawMaterial: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    }) as Promise<PurchaseOrder>;
  }

  async generateOrderNumber(storeId: string): Promise<string> {
    const count = await prisma.purchaseOrder.count({
      where: { storeId },
    });
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `PO-${year}${month}-${(count + 1).toString().padStart(4, "0")}`;
  }

  async getOrderCounts(storeId: string): Promise<{
    total: number;
    pending: number;
    ordered: number;
    partial: number;
    received: number;
  }> {
    const total = await prisma.purchaseOrder.count({
      where: { storeId },
    });

    const pending = await prisma.purchaseOrder.count({
      where: { storeId, status: "draft" },
    });

    const ordered = await prisma.purchaseOrder.count({
      where: { storeId, status: "ordered" },
    });

    const partial = await prisma.purchaseOrder.count({
      where: { storeId, status: "partial" },
    });

    const received = await prisma.purchaseOrder.count({
      where: { storeId, status: "received" },
    });

    return { total, pending, ordered, partial, received };
  }

  async getPendingOrders(storeId: string): Promise<PurchaseOrder[]> {
    return prisma.purchaseOrder.findMany({
      where: {
        storeId,
        status: { in: ["draft", "ordered", "partial"] },
      },
      orderBy: { expectedDate: "asc" },
      include: {
        supplier: true,
      },
    }) as Promise<PurchaseOrder[]>;
  }
}

export class PurchaseOrderItemService {
  async findById(id: string): Promise<PurchaseOrderItem | null> {
    return prisma.purchaseOrderItem.findUnique({
      where: { id },
      include: {
        rawMaterial: {
          include: {
            ingredient: true,
          },
        },
      },
    }) as Promise<PurchaseOrderItem | null>;
  }

  async findByOrder(purchaseOrderId: string): Promise<PurchaseOrderItem[]> {
    return prisma.purchaseOrderItem.findMany({
      where: { purchaseOrderId },
      include: {
        rawMaterial: {
          include: {
            ingredient: true,
          },
        },
      },
    }) as Promise<PurchaseOrderItem[]>;
  }

  async update(
    id: string,
    updates: Prisma.PurchaseOrderItemUpdateInput,
  ): Promise<PurchaseOrderItem> {
    return prisma.purchaseOrderItem.update({
      where: { id },
      data: updates,
    }) as Promise<PurchaseOrderItem>;
  }
}

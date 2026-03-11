import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { receivedItems } = body;

    const order = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });
    }

    for (const item of receivedItems) {
      await prisma.purchaseOrderItem.update({
        where: { id: item.itemId },
        data: {
          quantityReceived: item.quantityReceived,
        },
      });

      if (item.quantityReceived > 0) {
        const orderItem = order.items.find((i) => i.id === item.itemId);
        if (orderItem) {
          await prisma.rawMaterial.update({
            where: { id: orderItem.rawMaterialId },
            data: {
              currentStock: {
                increment: item.quantityReceived,
              },
            },
          });

          await prisma.inventoryTransaction.create({
            data: {
              rawMaterialId: orderItem.rawMaterialId,
              batchId: null,
              type: "receive",
              quantity: item.quantityReceived,
              notes: `Received from PO ${order.orderNumber}`,
              createdBy: session.user.id,
            },
          });
        }
      }
    }

    const updatedItems = await prisma.purchaseOrderItem.findMany({
      where: { purchaseOrderId: id },
    });

    const allFullyReceived = updatedItems.every(
      (item) => item.quantityReceived >= item.quantity
    );

    const anyPartiallyReceived = updatedItems.some(
      (item) => item.quantityReceived > 0 && item.quantityReceived < item.quantity
    );

    let newStatus = order.status;
    if (allFullyReceived) {
      newStatus = "received";
    } else if (anyPartiallyReceived) {
      newStatus = "partial";
    }

    const totalReceived = updatedItems.reduce(
      (sum, item) => sum + Number(item.quantityReceived) * Number(item.unitCost),
      0
    );

    const updatedOrder = await prisma.purchaseOrder.update({
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
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error receiving purchase order:", error);
    return NextResponse.json(
      { error: "Failed to receive purchase order" },
      { status: 500 }
    );
  }
}

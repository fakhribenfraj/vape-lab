import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const supplierId = searchParams.get("supplierId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {
      storeId: session.user.storeId,
    };

    if (status) {
      where.status = status;
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    const [orders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: {
          supplier: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    return NextResponse.json({ orders, total, limit, offset });
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchase orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, ...orderData } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" },
        { status: 400 }
      );
    }

    const totalCost = items.reduce(
      (sum: number, item: { quantity: number; unitCost: number }) =>
        sum + item.quantity * item.unitCost,
      0
    );

    const order = await prisma.purchaseOrder.create({
      data: {
        ...orderData,
        storeId: session.user.storeId!,
        createdBy: session.user.id,
        totalCost,
        items: {
          create: items.map((item: { rawMaterialId: string; quantity: number; unitCost: number }) => ({
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
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating purchase order:", error);
    return NextResponse.json(
      { error: "Failed to create purchase order" },
      { status: 500 }
    );
  }
}

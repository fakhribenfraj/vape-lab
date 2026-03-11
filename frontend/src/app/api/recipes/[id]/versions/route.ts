import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const recipe = await prisma.recipe.findFirst({
      where: {
        id,
        storeId: session.user.storeId,
      },
      select: {
        name: true,
        storeId: true,
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const versions = await prisma.recipe.findMany({
      where: {
        name: recipe.name,
        storeId: recipe.storeId,
      },
      select: {
        id: true,
        version: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: { id: true, name: true },
        },
        ingredients: {
          include: { ingredient: true },
        },
      },
      orderBy: { version: "desc" },
    });

    return NextResponse.json({ versions });
  } catch (error) {
    console.error("Error fetching recipe versions:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe versions" },
      { status: 500 }
    );
  }
}

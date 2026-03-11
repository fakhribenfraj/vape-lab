import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { recipeSchema, recipeIngredientSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {
      storeId: session.user.storeId,
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        include: {
          ingredients: {
            include: { ingredient: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.recipe.count({ where }),
    ]);

    return NextResponse.json({ recipes, total, limit, offset });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
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
    const validationResult = recipeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { ingredients, ...recipeData } = body;

    if (ingredients) {
      for (const ing of ingredients) {
        const ingValidation = recipeIngredientSchema.safeParse(ing);
        if (!ingValidation.success) {
          return NextResponse.json(
            { error: "Invalid ingredient data", details: ingValidation.error.errors },
            { status: 400 }
          );
        }
      }
    }

    const pgRatio = Number(recipeData.targetPgRatio);
    const vgRatio = Number(recipeData.targetVgRatio);
    if (pgRatio + vgRatio !== 100) {
      return NextResponse.json(
        { error: "PG and VG ratios must sum to 100" },
        { status: 400 }
      );
    }

    const recipe = await prisma.recipe.create({
      data: {
        ...recipeData,
        storeId: session.user.storeId!,
        createdBy: session.user.id,
        ingredients: ingredients
          ? {
              create: ingredients.map((ing: Record<string, unknown>) => ({
                ingredientId: ing.ingredientId,
                targetAmount: ing.targetAmount,
                orderIndex: ing.orderIndex,
              })),
            }
          : undefined,
      },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
      },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}

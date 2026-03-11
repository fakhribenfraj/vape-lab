import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { recipeSchema, recipeIngredientSchema } from "@/lib/validation";

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
      include: {
        ingredients: {
          include: { ingredient: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        id,
        storeId: session.user.storeId,
      },
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const validationResult = recipeSchema.partial().safeParse(body);

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

    if (recipeData.targetPgRatio !== undefined || recipeData.targetVgRatio !== undefined) {
      const pgRatio = Number(recipeData.targetPgRatio ?? existingRecipe.targetPgRatio);
      const vgRatio = Number(recipeData.targetVgRatio ?? existingRecipe.targetVgRatio);
      if (pgRatio + vgRatio !== 100) {
        return NextResponse.json(
          { error: "PG and VG ratios must sum to 100" },
          { status: 400 }
        );
      }
    }

    let recipe;

    if (ingredients) {
      const newVersion = existingRecipe.version + 1;

      recipe = await prisma.recipe.create({
        data: {
          storeId: existingRecipe.storeId,
          name: recipeData.name ?? existingRecipe.name,
          version: newVersion,
          description: recipeData.description ?? existingRecipe.description,
          steepingDurationHours:
            recipeData.steepingDurationHours ?? existingRecipe.steepingDurationHours,
          targetNicotineMg: recipeData.targetNicotineMg ?? existingRecipe.targetNicotineMg,
          targetPgRatio: recipeData.targetPgRatio ?? existingRecipe.targetPgRatio,
          targetVgRatio: recipeData.targetVgRatio ?? existingRecipe.targetVgRatio,
          status: recipeData.status ?? existingRecipe.status,
          createdBy: session.user.id,
          ingredients: {
            create: ingredients.map((ing: Record<string, unknown>) => ({
              ingredientId: ing.ingredientId,
              targetAmount: ing.targetAmount,
              orderIndex: ing.orderIndex,
            })),
          },
        },
        include: {
          ingredients: {
            include: { ingredient: true },
          },
        },
      });
    } else {
      recipe = await prisma.recipe.update({
        where: { id },
        data: recipeData,
        include: {
          ingredients: {
            include: { ingredient: true },
          },
        },
      });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        id,
        storeId: session.user.storeId,
      },
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    await prisma.recipe.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}

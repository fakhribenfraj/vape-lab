import { prisma } from "@/lib/db";

export interface Recipe {
  id: string;
  storeId: string;
  name: string;
  version: number;
  description?: string;
  steepingDurationHours: number;
  targetNicotineMg: number;
  targetPgRatio: number;
  targetVgRatio: number;
  status: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  ingredientId: string;
  targetAmount: number;
  orderIndex: number;
}

export interface Ingredient {
  id: string;
  name: string;
  type: string;
  unit: string;
  description?: string;
}

export class RecipeService {
  async create(recipeData: {
    storeId: string;
    name: string;
    version: number;
    description?: string;
    steepingDurationHours: number;
    targetNicotineMg: number;
    targetPgRatio: number;
    targetVgRatio: number;
    status: string;
    createdBy: string;
    ingredients: {
      ingredientId: string;
      targetAmount: number;
      orderIndex: number;
    }[];
  }): Promise<Recipe> {
    const { ingredients, ...recipeBase } = recipeData;

    const recipe = await prisma.recipe.create({
      data: recipeBase,
    });

    for (const ingredient of ingredients) {
      await prisma.recipeIngredient.create({
        data: {
          recipeId: recipe.id,
          ...ingredient,
        },
      });
    }

    return recipe;
  }

  async findById(id: string): Promise<Recipe | null> {
    return prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: true,
      },
    });
  }

  async findByStore(storeId: string): Promise<Recipe[]> {
    return prisma.recipe.findMany({
      where: { storeId },
      orderBy: { updatedAt: "desc" },
    });
  }

  async findIngredientsByRecipe(recipeId: string): Promise<RecipeIngredient[]> {
    return prisma.recipeIngredient.findMany({
      where: { recipeId },
      orderBy: { orderIndex: "asc" },
    });
  }

  async findIngredientsByRecipes(
    recipeIds: string[],
  ): Promise<RecipeIngredient[]> {
    return prisma.recipeIngredient.findMany({
      where: { recipeId: { in: recipeIds } },
      orderBy: { orderIndex: "asc" },
    });
  }

  async findByNameAndStore(
    storeId: string,
    name: string,
  ): Promise<Recipe | null> {
    return prisma.recipe.findFirst({
      where: { storeId, name },
      include: {
        ingredients: true,
      },
    });
  }

  async findLatestVersion(
    storeId: string,
    name: string,
  ): Promise<Recipe | null> {
    return prisma.recipe.findFirst({
      where: { storeId, name },
      orderBy: { version: "desc" },
      include: {
        ingredients: true,
      },
    });
  }

  async findAllVersions(storeId: string, name: string): Promise<Recipe[]> {
    return prisma.recipe.findMany({
      where: { storeId, name },
      orderBy: { version: "desc" },
      include: {
        ingredients: true,
      },
    });
  }

  async update(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    const recipe = await prisma.recipe.update({
      where: { id },
      data: updates,
      include: {
        ingredients: true,
      },
    });
    return recipe;
  }

  async updateWithIngredients(
    id: string,
    updates: Partial<Recipe>,
    ingredientUpdates: {
      ingredientId: string;
      targetAmount: number;
      orderIndex: number;
    }[],
  ): Promise<Recipe> {
    const recipe = await prisma.recipe.update({
      where: { id },
      data: updates,
    });

    // Delete existing ingredients
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: id },
    });

    // Create new ingredients
    for (const data of ingredientUpdates) {
      await prisma.recipeIngredient.create({
        data: {
          recipeId: id,
          ...data,
        },
      });
    }

    return recipe;
  }

  async delete(id: string): Promise<void> {
    await prisma.recipe.delete({
      where: { id },
    });
  }

  async createVersion(
    recipeId: string,
    versionData: Partial<Recipe>,
    ingredientUpdates: {
      ingredientId: string;
      targetAmount: number;
      orderIndex: number;
    }[],
  ): Promise<Recipe> {
    const originalRecipe = await this.findById(recipeId);
    if (!originalRecipe) {
      throw new Error("Original recipe not found");
    }

    const newVersion = originalRecipe.version + 1;
    const newRecipe = await this.create({
      ...originalRecipe,
      ...versionData,
      version: newVersion,
      id: undefined,
      ingredients: ingredientUpdates,
    });

    return newRecipe;
  }

  async getVersionHistory(recipeId: string): Promise<Recipe[]> {
    return prisma.recipe.findMany({
      where: { recipeId },
      orderBy: { version: "desc" },
      include: {
        ingredients: true,
      },
    });
  }

  async getIngredientById(id: string): Promise<Ingredient | null> {
    return prisma.ingredient.findUnique({
      where: { id },
    });
  }

  async getIngredientsByIds(ids: string[]): Promise<Ingredient[]> {
    return prisma.ingredient.findMany({
      where: { id: { in: ids } },
      orderBy: { name: "asc" },
    });
  }

  async searchRecipes(
    storeId: string,
    query: string,
    limit: number = 10,
  ): Promise<Recipe[]> {
    return prisma.recipe.findMany({
      where: {
        storeId,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { updatedAt: "desc" },
    });
  }

  async getRecipeCounts(storeId: string): Promise<{
    total: number;
    active: number;
    draft: number;
    archived: number;
  }> {
    const total = await prisma.recipe.count({
      where: { storeId },
    });

    const active = await prisma.recipe.count({
      where: { storeId, status: "active" },
    });

    const draft = await prisma.recipe.count({
      where: { storeId, status: "draft" },
    });

    const archived = await prisma.recipe.count({
      where: { storeId, status: "archived" },
    });

    return {
      total,
      active,
      draft,
      archived,
    };
  }
}

export class IngredientService {
  async create(ingredientData: {
    name: string;
    type: string;
    unit: string;
    description?: string;
  }): Promise<Ingredient> {
    const ingredient = await prisma.ingredient.create({
      data: ingredientData,
    });
    return ingredient;
  }

  async findById(id: string): Promise<Ingredient | null> {
    return prisma.ingredient.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Ingredient | null> {
    return prisma.ingredient.findFirst({
      where: { name },
    });
  }

  async findByType(type: string): Promise<Ingredient[]> {
    return prisma.ingredient.findMany({
      where: { type },
    });
  }

  async getAll(): Promise<Ingredient[]> {
    return prisma.ingredient.findMany({
      orderBy: { name: "asc" },
    });
  }

  async update(id: string, updates: Partial<Ingredient>): Promise<Ingredient> {
    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: updates,
    });
    return ingredient;
  }

  async delete(id: string): Promise<void> {
    await prisma.ingredient.delete({
      where: { id },
    });
  }

  async searchIngredients(
    query: string,
    limit: number = 10,
  ): Promise<Ingredient[]> {
    return prisma.ingredient.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { name: "asc" },
    });
  }
}

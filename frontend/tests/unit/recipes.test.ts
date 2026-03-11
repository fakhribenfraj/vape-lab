import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecipeService } from '@/lib/db/repositories/recipe';
import { prisma } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  prisma: {
    recipe: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    recipeIngredient: {
      create: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

describe('RecipeService', () => {
  let recipeService: RecipeService;

  beforeEach(() => {
    recipeService = new RecipeService();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a recipe with ingredients', async () => {
      const mockRecipe = {
        id: 'recipe-1',
        storeId: 'store-1',
        name: 'Test Recipe',
        version: 1,
        description: 'Test description',
        steepingDurationHours: 48,
        targetNicotineMg: 3,
        targetPgRatio: 50,
        targetVgRatio: 50,
        status: 'draft',
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.recipe.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipe);
      (prisma.recipeIngredient.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const result = await recipeService.create({
        storeId: 'store-1',
        name: 'Test Recipe',
        version: 1,
        description: 'Test description',
        steepingDurationHours: 48,
        targetNicotineMg: 3,
        targetPgRatio: 50,
        targetVgRatio: 50,
        status: 'draft',
        createdBy: 'user-1',
        ingredients: [
          { ingredientId: 'ing-1', targetAmount: 50, orderIndex: 0 },
        ],
      });

      expect(result).toEqual(mockRecipe);
      expect(prisma.recipe.create).toHaveBeenCalledWith({
        data: {
          storeId: 'store-1',
          name: 'Test Recipe',
          version: 1,
          description: 'Test description',
          steepingDurationHours: 48,
          targetNicotineMg: 3,
          targetPgRatio: 50,
          targetVgRatio: 50,
          status: 'draft',
          createdBy: 'user-1',
        },
      });
    });

    it('should create a recipe without ingredients', async () => {
      const mockRecipe = {
        id: 'recipe-1',
        storeId: 'store-1',
        name: 'Test Recipe',
        version: 1,
        description: 'Test description',
        steepingDurationHours: 48,
        targetNicotineMg: 3,
        targetPgRatio: 50,
        targetVgRatio: 50,
        status: 'draft',
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.recipe.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipe);

      const result = await recipeService.create({
        storeId: 'store-1',
        name: 'Test Recipe',
        version: 1,
        description: 'Test description',
        steepingDurationHours: 48,
        targetNicotineMg: 3,
        targetPgRatio: 50,
        targetVgRatio: 50,
        status: 'draft',
        createdBy: 'user-1',
        ingredients: [],
      });

      expect(result).toEqual(mockRecipe);
    });
  });

  describe('findById', () => {
    it('should return recipe by id with ingredients', async () => {
      const mockRecipe = {
        id: 'recipe-1',
        storeId: 'store-1',
        name: 'Test Recipe',
        version: 1,
        ingredients: [{ id: 'ri-1', ingredientId: 'ing-1', targetAmount: 50, orderIndex: 0 }],
      };

      (prisma.recipe.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipe);

      const result = await recipeService.findById('recipe-1');

      expect(result).toEqual(mockRecipe);
      expect(prisma.recipe.findUnique).toHaveBeenCalledWith({
        where: { id: 'recipe-1' },
        include: { ingredients: true },
      });
    });

    it('should return null if recipe not found', async () => {
      (prisma.recipe.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const result = await recipeService.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByStore', () => {
    it('should return all recipes for a store', async () => {
      const mockRecipes = [
        { id: 'recipe-1', name: 'Recipe 1', storeId: 'store-1' },
        { id: 'recipe-2', name: 'Recipe 2', storeId: 'store-1' },
      ];

      (prisma.recipe.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipes);

      const result = await recipeService.findByStore('store-1');

      expect(result).toEqual(mockRecipes);
      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: { storeId: 'store-1' },
        orderBy: { updatedAt: 'desc' },
      });
    });
  });

  describe('update', () => {
    it('should update a recipe', async () => {
      const mockRecipe = {
        id: 'recipe-1',
        name: 'Updated Recipe',
        version: 1,
      };

      (prisma.recipe.update as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipe);

      const result = await recipeService.update('recipe-1', { name: 'Updated Recipe' });

      expect(result).toEqual(mockRecipe);
      expect(prisma.recipe.update).toHaveBeenCalledWith({
        where: { id: 'recipe-1' },
        data: { name: 'Updated Recipe' },
        include: { ingredients: true },
      });
    });
  });

  describe('delete', () => {
    it('should delete a recipe', async () => {
      (prisma.recipe.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await recipeService.delete('recipe-1');

      expect(prisma.recipe.delete).toHaveBeenCalledWith({
        where: { id: 'recipe-1' },
      });
    });
  });

  describe('searchRecipes', () => {
    it('should search recipes by name or description', async () => {
      const mockRecipes = [
        { id: 'recipe-1', name: 'Test Recipe', storeId: 'store-1' },
      ];

      (prisma.recipe.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecipes);

      const result = await recipeService.searchRecipes('store-1', 'test');

      expect(result).toEqual(mockRecipes);
      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: {
          storeId: 'store-1',
          OR: [
            { name: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        take: 10,
        orderBy: { updatedAt: 'desc' },
      });
    });
  });

  describe('getRecipeCounts', () => {
    it('should return recipe counts by status', async () => {
      (prisma.recipe.count as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(5)  // active
        .mockResolvedValueOnce(3)  // draft
        .mockResolvedValueOnce(2); // archived

      const result = await recipeService.getRecipeCounts('store-1');

      expect(result).toEqual({
        total: 10,
        active: 5,
        draft: 3,
        archived: 2,
      });
    });
  });
});

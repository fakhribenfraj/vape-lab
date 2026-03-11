import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IngredientService } from '@/lib/db/repositories/recipe';
import { prisma } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  prisma: {
    ingredient: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('IngredientService', () => {
  let ingredientService: IngredientService;

  beforeEach(() => {
    ingredientService = new IngredientService();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create an ingredient', async () => {
      const mockIngredient = {
        id: 'ing-1',
        name: 'PG',
        type: 'pg' as const,
        unit: 'ml',
        description: 'Propylene Glycol',
      };

      (prisma.ingredient.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockIngredient);

      const result = await ingredientService.create({
        name: 'PG',
        type: 'pg',
        unit: 'ml',
        description: 'Propylene Glycol',
      });

      expect(result).toEqual(mockIngredient);
      expect(prisma.ingredient.create).toHaveBeenCalledWith({
        data: {
          name: 'PG',
          type: 'pg',
          unit: 'ml',
          description: 'Propylene Glycol',
        },
      });
    });

    it('should create ingredient without description', async () => {
      const mockIngredient = {
        id: 'ing-1',
        name: 'VG',
        type: 'vg' as const,
        unit: 'ml',
      };

      (prisma.ingredient.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockIngredient);

      const result = await ingredientService.create({
        name: 'VG',
        type: 'vg',
        unit: 'ml',
      });

      expect(result).toEqual(mockIngredient);
    });
  });

  describe('findById', () => {
    it('should return ingredient by id', async () => {
      const mockIngredient = {
        id: 'ing-1',
        name: 'PG',
        type: 'pg' as const,
        unit: 'ml',
      };

      (prisma.ingredient.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockIngredient);

      const result = await ingredientService.findById('ing-1');

      expect(result).toEqual(mockIngredient);
      expect(prisma.ingredient.findUnique).toHaveBeenCalledWith({
        where: { id: 'ing-1' },
      });
    });

    it('should return null if ingredient not found', async () => {
      (prisma.ingredient.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const result = await ingredientService.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return ingredient by name', async () => {
      const mockIngredient = {
        id: 'ing-1',
        name: 'PG',
        type: 'pg' as const,
        unit: 'ml',
      };

      (prisma.ingredient.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockIngredient);

      const result = await ingredientService.findByName('PG');

      expect(result).toEqual(mockIngredient);
      expect(prisma.ingredient.findFirst).toHaveBeenCalledWith({
        where: { name: 'PG' },
      });
    });
  });

  describe('findByType', () => {
    it('should return ingredients by type', async () => {
      const mockIngredients = [
        { id: 'ing-1', name: 'PG', type: 'pg' as const, unit: 'ml' },
        { id: 'ing-2', name: 'VG', type: 'vg' as const, unit: 'ml' },
      ];

      (prisma.ingredient.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockIngredients);

      const result = await ingredientService.findByType('pg');

      expect(result).toEqual(mockIngredients);
      expect(prisma.ingredient.findMany).toHaveBeenCalledWith({
        where: { type: 'pg' },
      });
    });
  });

  describe('getAll', () => {
    it('should return all ingredients sorted by name', async () => {
      const mockIngredients = [
        { id: 'ing-1', name: 'PG', type: 'pg', unit: 'ml' },
        { id: 'ing-2', name: 'VG', type: 'vg', unit: 'ml' },
      ];

      (prisma.ingredient.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockIngredients);

      const result = await ingredientService.getAll();

      expect(result).toEqual(mockIngredients);
      expect(prisma.ingredient.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('update', () => {
    it('should update an ingredient', async () => {
      const mockIngredient = {
        id: 'ing-1',
        name: 'Updated PG',
        type: 'pg' as const,
        unit: 'ml',
      };

      (prisma.ingredient.update as ReturnType<typeof vi.fn>).mockResolvedValue(mockIngredient);

      const result = await ingredientService.update('ing-1', { name: 'Updated PG' });

      expect(result).toEqual(mockIngredient);
      expect(prisma.ingredient.update).toHaveBeenCalledWith({
        where: { id: 'ing-1' },
        data: { name: 'Updated PG' },
      });
    });
  });

  describe('delete', () => {
    it('should delete an ingredient', async () => {
      (prisma.ingredient.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await ingredientService.delete('ing-1');

      expect(prisma.ingredient.delete).toHaveBeenCalledWith({
        where: { id: 'ing-1' },
      });
    });
  });

  describe('searchIngredients', () => {
    it('should search ingredients by name or description', async () => {
      const mockIngredients = [
        { id: 'ing-1', name: 'PG', type: 'pg', unit: 'ml' },
      ];

      (prisma.ingredient.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockIngredients);

      const result = await ingredientService.searchIngredients('pg');

      expect(result).toEqual(mockIngredients);
      expect(prisma.ingredient.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'pg', mode: 'insensitive' } },
            { description: { contains: 'pg', mode: 'insensitive' } },
          ],
        },
        take: 10,
        orderBy: { name: 'asc' },
      });
    });
  });
});

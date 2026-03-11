import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["owner", "technician", "manager"]).optional(),
});

export const recipeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  steepingDurationHours: z.number().int().positive(),
  targetNicotineMg: z.number().min(0).max(20),
  targetPgRatio: z.number().min(0).max(100),
  targetVgRatio: z.number().min(0).max(100),
});

export const recipeIngredientSchema = z.object({
  ingredientId: z.string().uuid(),
  targetAmount: z.number().positive(),
  orderIndex: z.number().int().min(0),
});

export const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.enum(["pg", "vg", "nicotine", "flavor", "additive"]),
  unit: z.string().min(1, "Unit is required"),
  description: z.string().optional(),
});

export const batchSchema = z.object({
  recipeId: z.string().uuid(),
  notes: z.string().optional(),
});

export const batchIngredientSchema = z.object({
  ingredientId: z.string().uuid(),
  rawMaterialId: z.string().uuid().optional(),
  actualAmount: z.number().positive(),
  targetAmount: z.number().positive(),
});

export const customerSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  name: z.string().min(1, "Name is required").max(100),
});

export const loyaltyTransactionSchema = z.object({
  type: z.enum(["earn", "redeem"]),
  points: z.number().int().positive(),
  description: z.string().min(1, "Description is required"),
});

export const inventoryReceiveSchema = z.object({
  quantity: z.number().positive(),
  lotNumber: z.string().optional(),
  costPerUnit: z.number().positive().optional(),
  supplier: z.string().optional(),
  expiryDate: z.string().optional(),
});

export const inventoryAdjustSchema = z.object({
  quantity: z.number(),
  notes: z.string().optional(),
});

import { recipeService } from "@/lib/db/repositories";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe, RecipeIngredient } from "@/lib/db/repositories/recipe";

export function useRecipes(storeId: string) {
  return useQuery<Recipe[]>({
    queryKey: ["recipes", storeId],
    queryFn: async () => {
      return await recipeService.findByStore(storeId);
    },
    staleTime: 60 * 1000,
  });
}

export function useRecipe(id: string) {
  return useQuery<Recipe | null>({
    queryKey: ["recipe", id],
    queryFn: async () => {
      return await recipeService.findById(id);
    },
    staleTime: 30 * 1000,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipeData: {
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
    }) => {
      return await recipeService.create(recipeData);
    },
    onSuccess: (newRecipe, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recipes", variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ["recipe", newRecipe.id] });
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: {
      id: string;
      updates: Partial<Recipe>;
      ingredientUpdates: {
        ingredientId: string;
        targetAmount: number;
        orderIndex: number;
      }[];
    }) => {
      return await recipeService.updateWithIngredients(
        updates.id,
        updates.updates,
        updates.ingredientUpdates
      );
    },
    onSuccess: (updatedRecipe, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recipes", updatedRecipe.storeId] });
      queryClient.invalidateQueries({ queryKey: ["recipe", variables.id] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await recipeService.delete(id);
    },
    onSuccess: (_, id) => {
      const recipeQuery = queryClient.getQueryData(["recipe", id]);
      if (recipeQuery) {
        queryClient.invalidateQueries({ queryKey: ["recipes", recipeQuery.storeId] });
      }
    },
  });
}

export function useCreateRecipeVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionData: {
      recipeId: string;
      versionData: Partial<Recipe>;
      ingredientUpdates: {
        ingredientId: string;
        targetAmount: number;
        orderIndex: number;
      }[];
    }) => {
      return await recipeService.createVersion(
        versionData.recipeId,
        versionData.versionData,
        versionData.ingredientUpdates
      );
    },
    onSuccess: (newVersion, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recipes", newVersion.storeId] });
      queryClient.invalidateQueries({ queryKey: ["recipe", variables.recipeId] });
    },
  });
}

export function useRecipeVersions(recipeId: string) {
  return useQuery<Recipe[]>({
    queryKey: ["recipe-versions", recipeId],
    queryFn: async () => {
      return await recipeService.getVersionHistory(recipeId);
    },
    staleTime: 60 * 1000,
  });
}

export function useSearchRecipes(storeId: string, query: string) {
  return useQuery<Recipe[]>({
    queryKey: ["recipes-search", storeId, query],
    queryFn: async () => {
      return await recipeService.searchRecipes(storeId, query);
    },
    staleTime: 30 * 1000,
  });
}

export function useRecipeCounts(storeId: string) {
  return useQuery({
    queryKey: ["recipes-count", storeId],
    queryFn: async () => {
      return await recipeService.getRecipeCounts(storeId);
    },
    staleTime: 5 * 60 * 1000,
  });
}

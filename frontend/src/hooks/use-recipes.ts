import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  ingredients: Array<{
    id: string;
    recipeId: string;
    ingredientId: string;
    targetAmount: number;
    orderIndex: number;
    ingredient: {
      id: string;
      name: string;
      category: string;
    };
  }>;
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }
  return response.json();
}

export function useRecipes(storeId: string) {
  return useQuery<Recipe[]>({
    queryKey: ["recipes", storeId],
    queryFn: async () => {
      const result = await fetchApi<{ recipes: Recipe[] }>(`/api/recipes?limit=100`);
      return result.recipes;
    },
    staleTime: 60 * 1000,
  });
}

export function useRecipe(id: string) {
  return useQuery<Recipe | null>({
    queryKey: ["recipe", id],
    queryFn: async () => {
      return await fetchApi<Recipe>(`/api/recipes/${id}`);
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
      return await fetchApi<Recipe>("/api/recipes", {
        method: "POST",
        body: JSON.stringify(recipeData),
      });
    },
    onSuccess: (newRecipe) => {
      queryClient.invalidateQueries({
        queryKey: ["recipes", newRecipe.storeId],
      });
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
      return await fetchApi<Recipe>(`/api/recipes/${updates.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...updates.updates, ingredients: updates.ingredientUpdates }),
      });
    },
    onSuccess: (updatedRecipe) => {
      queryClient.invalidateQueries({
        queryKey: ["recipes", updatedRecipe.storeId],
      });
      queryClient.invalidateQueries({ queryKey: ["recipe", updatedRecipe.id] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await fetchApi<{ success: boolean }>(`/api/recipes/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
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
      return await fetchApi<Recipe>(`/api/recipes/${versionData.recipeId}`, {
        method: "PATCH",
        body: JSON.stringify({ ...versionData.versionData, ingredients: versionData.ingredientUpdates }),
      });
    },
    onSuccess: (newVersion) => {
      queryClient.invalidateQueries({
        queryKey: ["recipes", newVersion.storeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["recipe", newVersion.id],
      });
    },
  });
}

export function useRecipeVersions(recipeId: string) {
  return useQuery<Recipe[]>({
    queryKey: ["recipe-versions", recipeId],
    queryFn: async () => {
      return await fetchApi<Recipe[]>(`/api/recipes/${recipeId}/versions`);
    },
    staleTime: 60 * 1000,
  });
}

export function useSearchRecipes(storeId: string, query: string) {
  return useQuery<Recipe[]>({
    queryKey: ["recipes-search", storeId, query],
    queryFn: async () => {
      const result = await fetchApi<{ recipes: Recipe[] }>(`/api/recipes?q=${encodeURIComponent(query)}`);
      return result.recipes;
    },
    staleTime: 30 * 1000,
  });
}

export function useRecipeCounts(storeId: string) {
  return useQuery({
    queryKey: ["recipes-count", storeId],
    queryFn: async () => {
      const result = await fetchApi<{ recipes: Recipe[] }>(`/api/recipes?limit=1000`);
      return {
        total: result.recipes.length,
        active: result.recipes.filter(r => r.status === "active").length,
        draft: result.recipes.filter(r => r.status === "draft").length,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

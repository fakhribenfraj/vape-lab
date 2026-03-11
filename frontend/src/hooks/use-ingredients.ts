import { recipeService } from "@/lib/db/repositories";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Ingredient {
  id: string;
  name: string;
  type: string;
  unit: string;
  description?: string;
}

export function useIngredients() {
  return useQuery<Ingredient[]>({
    queryKey: ["ingredients"],
    queryFn: async () => {
      return await ingredientService.getAll();
    },
    staleTime: 60 * 1000,
  });
}

export function useIngredient(id: string) {
  return useQuery<Ingredient | null>({
    queryKey: ["ingredient", id],
    queryFn: async () => {
      return await ingredientService.findById(id);
    },
    staleTime: 30 * 1000,
  });
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ingredientData: {
      name: string;
      type: string;
      unit: string;
      description?: string;
    }) => {
      return await ingredientService.create(ingredientData);
    },
    onSuccess: (newIngredient) => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: {
      id: string;
      updates: Partial<Ingredient>;
    }) => {
      return await ingredientService.update(updates.id, updates.updates);
    },
    onSuccess: (updatedIngredient) => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      queryClient.invalidateQueries({ queryKey: ["ingredient", updatedIngredient.id] });
    },
  });
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await ingredientService.delete(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      queryClient.invalidateQueries({ queryKey: ["ingredient", id] });
    },
  });
}

export function useSearchIngredients(query: string) {
  return useQuery<Ingredient[]>({
    queryKey: ["ingredients-search", query],
    queryFn: async () => {
      return await ingredientService.searchIngredients(query);
    },
    staleTime: 30 * 1000,
  });
}

export function useIngredientsByType(type: string) {
  return useQuery<Ingredient[]>({
    queryKey: ["ingredients-type", type],
    queryFn: async () => {
      return await ingredientService.findByType(type);
    },
    staleTime: 60 * 1000,
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Ingredient {
  id: string;
  name: string;
  type: string;
  unit: string;
  description?: string;
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

export function useIngredients() {
  return useQuery<Ingredient[]>({
    queryKey: ["ingredients"],
    queryFn: async () => {
      return await fetchApi<Ingredient[]>("/api/ingredients");
    },
    staleTime: 60 * 1000,
  });
}

export function useIngredient(id: string) {
  return useQuery<Ingredient | null>({
    queryKey: ["ingredient", id],
    queryFn: async () => {
      return await fetchApi<Ingredient>(`/api/ingredients/${id}`);
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
      return await fetchApi<Ingredient>("/api/ingredients", {
        method: "POST",
        body: JSON.stringify(ingredientData),
      });
    },
    onSuccess: () => {
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
      return await fetchApi<Ingredient>(`/api/ingredients/${updates.id}`, {
        method: "PATCH",
        body: JSON.stringify(updates.updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await fetchApi<{ success: boolean }>(`/api/ingredients/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
}

export function useSearchIngredients(query: string) {
  return useQuery<Ingredient[]>({
    queryKey: ["ingredients-search", query],
    queryFn: async () => {
      return await fetchApi<Ingredient[]>(`/api/ingredients?q=${encodeURIComponent(query)}`);
    },
    staleTime: 30 * 1000,
  });
}

export function useIngredientsByType(type: string) {
  return useQuery<Ingredient[]>({
    queryKey: ["ingredients-type", type],
    queryFn: async () => {
      return await fetchApi<Ingredient[]>(`/api/ingredients?type=${encodeURIComponent(type)}`);
    },
    staleTime: 60 * 1000,
  });
}

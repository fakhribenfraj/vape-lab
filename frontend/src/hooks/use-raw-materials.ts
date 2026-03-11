import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const rawMaterials: Record<string, unknown> = {};

async function fetchRawMaterials(storeId: string) {
  const response = await fetch(`/api/inventory?storeId=${storeId}`);
  if (!response.ok) throw new Error("Failed to fetch raw materials");
  return response.json();
}

async function fetchRawMaterial(id: string) {
  const response = await fetch(`/api/inventory/${id}`);
  if (!response.ok) throw new Error("Failed to fetch raw material");
  return response.json();
}

export function useRawMaterials(storeId: string) {
  return useQuery({
    queryKey: ["rawMaterials", storeId],
    queryFn: () => fetchRawMaterials(storeId),
    enabled: !!storeId,
  });
}

export function useRawMaterial(id: string) {
  return useQuery({
    queryKey: ["rawMaterial", id],
    queryFn: () => fetchRawMaterial(id),
    enabled: !!id,
  });
}

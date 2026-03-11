import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

export function useSuppliers(storeId: string) {
  return useQuery({
    queryKey: ["suppliers", storeId],
    queryFn: () => fetchApi<{ suppliers: Record<string, unknown>[] }>(`/api/suppliers?storeId=${storeId}`).then((r) => r.suppliers),
    enabled: !!storeId,
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: () => fetchApi<Record<string, unknown>>(`/api/suppliers/${id}`),
    enabled: !!id,
  });
}

export function useSupplierCounts(storeId: string) {
  return useQuery({
    queryKey: ["supplierCounts", storeId],
    queryFn: () => fetchApi<{ total: number; active: number }>(`/api/suppliers?storeId=${storeId}&counts=true`).then((r) => ({ total: r.total || 0, active: r.active || 0 })),
    enabled: !!storeId,
  });
}

export function useSearchSuppliers(storeId: string, query: string) {
  return useQuery({
    queryKey: ["suppliers", "search", storeId, query],
    queryFn: () => fetchApi<{ suppliers: Record<string, unknown>[] }>(`/api/suppliers?q=${query}&storeId=${storeId}`).then((r) => r.suppliers),
    enabled: !!storeId && query.length > 0,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetchApi<Record<string, unknown>>("/api/suppliers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Record<string, unknown>;
    }) =>
      fetchApi<Record<string, unknown>>(`/api/suppliers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["supplier", data.id] });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi<{ success: boolean }>(`/api/suppliers/${id}`, {
        method: "DELETE",
      }).then((r) => r.success),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function usePurchaseOrders(storeId: string) {
  return useQuery({
    queryKey: ["purchaseOrders", storeId],
    queryFn: () => fetchApi<{ orders: Record<string, unknown>[] }>(`/api/purchases?storeId=${storeId}`).then((r) => r.orders),
    enabled: !!storeId,
  });
}

export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: ["purchaseOrder", id],
    queryFn: () => fetchApi<Record<string, unknown>>(`/api/purchases/${id}`),
    enabled: !!id,
  });
}

export function usePurchaseOrderCounts(storeId: string) {
  return useQuery({
    queryKey: ["purchaseOrderCounts", storeId],
    queryFn: () =>
      fetchApi<{ total: number; pending: number; ordered: number; partial: number; received: number }>(
        `/api/purchases?storeId=${storeId}&counts=true`
      ).then((r) => ({
        total: r.total || 0,
        pending: r.pending || 0,
        ordered: r.ordered || 0,
        partial: r.partial || 0,
        received: r.received || 0,
      })),
    enabled: !!storeId,
  });
}

export function usePendingPurchaseOrders(storeId: string) {
  return useQuery({
    queryKey: ["purchaseOrders", "pending", storeId],
    queryFn: () =>
      fetchApi<{ orders: Record<string, unknown>[] }>(
        `/api/purchases?storeId=${storeId}&status=draft,ordered,partial`
      ).then((r) => r.orders),
    enabled: !!storeId,
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetchApi<Record<string, unknown>>("/api/purchases", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
    },
  });
}

export function useReceivePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      receivedItems,
    }: {
      id: string;
      receivedItems: { itemId: string; quantityReceived: number }[];
    }) =>
      fetchApi<Record<string, unknown>>(`/api/purchases/${id}/receive`, {
        method: "POST",
        body: JSON.stringify({ receivedItems }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
      queryClient.invalidateQueries({ queryKey: ["purchaseOrder"] });
    },
  });
}

export function useUpdatePurchaseOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) =>
      fetchApi<Record<string, unknown>>(`/api/purchases/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
      queryClient.invalidateQueries({ queryKey: ["purchaseOrder"] });
    },
  });
}

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi<{ success: boolean }>(`/api/purchases/${id}`, {
        method: "DELETE",
      }).then((r) => r.success),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
    },
  });
}

export function useGenerateOrderNumber(storeId: string) {
  return useQuery({
    queryKey: ["orderNumber", storeId],
    queryFn: async () => {
      const response = await fetch(`/api/purchases?storeId=${storeId}&generateOrderNumber=true`);
      const data = await response.json();
      return data.orderNumber as string;
    },
    enabled: !!storeId,
  });
}

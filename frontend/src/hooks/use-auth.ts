"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { Session } from "better-auth";

export function useSession() {
  return useQuery<Session | null>({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      console.log("Session data:", data);
      return data?.session ?? null;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data, error } = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/");
      router.refresh();
    },
  });
}

export function useSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
    }) => {
      const { data: result, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      if (error) throw new Error(error.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/");
      router.refresh();
    },
  });
}

export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/");
      router.refresh();
    },
  });
}

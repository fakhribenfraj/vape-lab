"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateRecipe } from "@/hooks/use-recipes";
import { useIngredients } from "@/hooks/use-ingredients";
import { useSession } from "@/hooks/use-auth";
import RecipeForm from "@/components/recipes/recipe-form";

export default function CreateRecipePage() {
  const { data: session } = useSession();
  const { data: ingredients } = useIngredients();
  const { mutate: createRecipe, isLoading } = useCreateRecipe();

  const handleSubmit = async (data: {
    name: string;
    description?: string;
    steepingDurationHours: number;
    targetNicotineMg: number;
    targetPgRatio: number;
    targetVgRatio: number;
    ingredients: {
      ingredientId: string;
      targetAmount: number;
      orderIndex: number;
    }[];
  }) => {
    try {
      await createRecipe({
        storeId: session?.user?.storeId || "",
        name: data.name,
        version: 1,
        description: data.description,
        steepingDurationHours: data.steepingDurationHours,
        targetNicotineMg: data.targetNicotineMg,
        targetPgRatio: data.targetPgRatio,
        targetVgRatio: data.targetVgRatio,
        status: "draft",
        createdBy: session?.user?.id || "",
        ingredients: data.ingredients,
      });
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Create New Recipe</CardTitle>
            <CardDescription>
              Create a new e-liquid recipe with precise measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecipeForm
              onSubmit={handleSubmit}
              onCancel={() => {
                window.location.href = "/recipes";
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

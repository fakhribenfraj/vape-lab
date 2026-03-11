"use client";

import RecipeForm from "@/components/recipes/recipe-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/hooks/use-auth";
import { useIngredients } from "@/hooks/use-ingredients";
import {
  useCreateRecipeVersion,
  useDeleteRecipe,
  useRecipe,
  useRecipeVersions,
} from "@/hooks/use-recipes";
import { useRouter } from "next/navigation";

interface EditRecipePageProps {
  params: {
    id: string;
  };
}

export default function EditRecipePage({ params }: EditRecipePageProps) {
  const { data: session } = useSession();
  const { data: recipe, isLoading: recipeLoading } = useRecipe(params.id);
  const { data: ingredients } = useIngredients();
  const { data: versions } = useRecipeVersions(params.id);
  const { mutate: createVersion } = useCreateRecipeVersion();
  const { mutate: deleteRecipe, isPending: deleteLoading } = useDeleteRecipe();
  const router = useRouter();

  if (recipeLoading || !recipe) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    );
  }

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
      await createVersion({
        recipeId: recipe.id,
        versionData: {
          name: data.name,
          description: data.description,
          steepingDurationHours: data.steepingDurationHours,
          targetNicotineMg: data.targetNicotineMg,
          targetPgRatio: data.targetPgRatio,
          targetVgRatio: data.targetVgRatio,
        },
        ingredientUpdates: data.ingredients,
      });
    } catch (error) {
      console.error("Error creating recipe version:", error);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this recipe? This cannot be undone.",
      )
    ) {
      await deleteRecipe(recipe.id);
      router.push("/recipes");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Edit Recipe - Version {recipe.version}</CardTitle>
            <CardDescription>
              Creating a new version will preserve the original recipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Current Name
                  </label>
                  <p className="text-sm">{recipe.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Current Version
                  </label>
                  <p className="text-sm">{recipe.version}</p>
                </div>
              </div>

              <RecipeForm
                onSubmit={handleSubmit}
                onCancel={() => router.push("/recipes")}
                initialValues={{
                  name: recipe.name,
                  description: recipe.description,
                  steepingDurationHours: recipe.steepingDurationHours,
                  targetNicotineMg: recipe.targetNicotineMg,
                  targetPgRatio: recipe.targetPgRatio,
                  targetVgRatio: recipe.targetVgRatio,
                }}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                Delete Recipe
              </Button>
              <Button
                type="submit"
                disabled={!session?.user?.id}
                className="flex-1"
              >
                Create New Version
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

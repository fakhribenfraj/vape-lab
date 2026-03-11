"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useIngredients } from "@/hooks/use-ingredients";
import { useRecipe, useRecipeVersions } from "@/hooks/use-recipes";
import Link from "next/dist/client/link";

interface RecipeDetailPageProps {
  params: {
    id: string;
  };
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { data: recipe, isLoading: recipeLoading } = useRecipe(params.id);
  const { data: versions } = useRecipeVersions(params.id);
  const { data: ingredients } = useIngredients();

  if (recipeLoading || !recipe) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    );
  }

  const currentVersion = versions?.[0] || recipe;
  const versionList = versions || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Recipe Details - Version {currentVersion.version}
            </CardTitle>
            <CardDescription>
              Detailed information about this recipe version
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm mt-1">{currentVersion.name}</p>
                </div>
                <div>
                  <Label>Version</Label>
                  <p className="text-sm mt-1">{currentVersion.version}</p>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1 text-muted-foreground">
                    {currentVersion.description || "No description"}
                  </p>
                </div>
                <div>
                  <Label>Steeping Duration</Label>
                  <p className="text-sm mt-1">
                    {currentVersion.steepingDurationHours} hours
                  </p>
                </div>
                <div>
                  <Label>Nicotine Strength</Label>
                  <p className="text-sm mt-1">
                    {currentVersion.targetNicotineMg} mg/ml
                  </p>
                </div>
                <div>
                  <Label>PG/VG Ratio</Label>
                  <p className="text-sm mt-1">
                    {currentVersion.targetPgRatio}% PG /{" "}
                    {currentVersion.targetVgRatio}% VG
                  </p>
                </div>
              </div>

              <div>
                <Label>Ingredients</Label>
                <div className="space-y-2 mt-2">
                  {currentVersion.ingredients?.map(
                    (ingredient, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium">
                            {ingredients?.find(
                              (i) => i.id === ingredient.ingredientId,
                            )?.name || ingredient.ingredientId}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {ingredient.targetAmount} units
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
            <CardDescription>Previous versions of this recipe</CardDescription>
          </CardHeader>
          <CardContent>
            {versionList.length > 1 ? (
              <div className="space-y-3">
                {versionList.map((version, index) => (
                  <div
                    key={version.id}
                    className="border-l-2 border-muted pl-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Version {version.version}</p>
                        <p className="text-sm text-muted-foreground">
                          Created:{" "}
                          {new Date(version.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            // Navigate to version view
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No previous versions</p>
            )}
          </CardContent>
        </Card>

        <div className="flex space-x-3">
          <Button asChild>
            <Link href={`/recipes/${params.id}/edit`}>Edit Recipe</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/recipes">Back to Recipes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

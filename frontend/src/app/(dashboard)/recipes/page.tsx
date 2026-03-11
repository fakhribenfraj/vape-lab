"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRecipes, useRecipeCounts } from "@/hooks/use-recipes";
import { useSearchRecipes } from "@/hooks/use-recipes";
import { useSession } from "@/hooks/use-auth";
import { useState } from "react";
import Link from "next/link";

export default function RecipesPage() {
  const { data: session } = useSession();
  const { data: recipes } = useRecipes(session?.user?.storeId || "");
  const { data: counts } = useRecipeCounts(session?.user?.storeId || "");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults } = useSearchRecipes(
    session?.user?.storeId || "",
    searchQuery,
  );

  const filteredRecipes = searchQuery ? searchResults : recipes;

  return (
    <div className="space-y-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recipes</CardTitle>
            <CardDescription>
              Manage your e-liquid recipes and versions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Recipes</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button asChild>
                <Link href="/recipes/create">Create Recipe</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {counts && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Recipe Counts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>{counts.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active:</span>
                      <span>{counts.active}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Draft:</span>
                      <span>{counts.draft}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Archived:</span>
                      <span>{counts.archived}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {filteredRecipes && filteredRecipes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No recipes found. Create your first recipe to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecipes?.map((recipe) => (
                  <Card key={recipe.id}>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {recipe.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Version {recipe.version}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`badge bg-${recipe.status}`}>
                            {recipe.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Target Nicotine
                          </label>
                          <p className="text-sm">
                            {recipe.targetNicotineMg} mg/ml
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            PG/VG Ratio
                          </label>
                          <p className="text-sm">
                            {recipe.targetPgRatio}% PG / {recipe.targetVgRatio}%
                            VG
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/recipes/${recipe.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/recipes/${recipe.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

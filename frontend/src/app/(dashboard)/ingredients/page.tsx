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
import {
  useCreateIngredient,
  useDeleteIngredient,
  useIngredients,
  useUpdateIngredient,
} from "@/hooks/use-ingredients";
import { ingredientSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function IngredientManagement() {
  const { data: ingredients, isLoading } = useIngredients();
  const createIngredient = useCreateIngredient();
  const updateIngredient = useUpdateIngredient();
  const deleteIngredient = useDeleteIngredient();

  const [editingIngredient, setEditingIngredient] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: "",
      type: "flavor",
      unit: "",
      description: "",
    },
  });

  const handleCreate = async (data: {
    name: string;
    type: string;
    unit: string;
    description?: string;
  }) => {
    try {
      await createIngredient.mutateAsync(data);
      reset();
      setEditingIngredient(null);
    } catch (error) {
      console.error("Error creating ingredient:", error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: {
      name: string;
      type: string;
      unit: string;
      description?: string;
    },
  ) => {
    try {
      await updateIngredient.mutateAsync({ id, updates: data });
      setEditingIngredient(null);
    } catch (error) {
      console.error("Error updating ingredient:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this ingredient?")) {
      try {
        await deleteIngredient.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting ingredient:", error);
      }
    }
  };

  const handleEdit = (ingredient: any) => {
    setEditingIngredient(ingredient.id);
    setValue("name", ingredient.name);
    setValue("type", ingredient.type);
    setValue("unit", ingredient.unit);
    setValue("description", ingredient.description || "");
  };

  const handleCancel = () => {
    reset();
    setEditingIngredient(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading ingredients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingredient Management</CardTitle>
            <CardDescription>
              Manage all ingredients used in your recipes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(
                editingIngredient
                  ? (data) => handleUpdate(editingIngredient, data)
                  : handleCreate,
              )}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Ingredient Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter ingredient name"
                    {...register("name")}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      type="text"
                      placeholder="Enter ingredient type"
                      {...register("type")}
                      className={errors.type ? "border-destructive" : ""}
                    />
                    {errors.type && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      type="text"
                      placeholder="Enter unit (ml, g, etc)"
                      {...register("unit")}
                      className={errors.unit ? "border-destructive" : ""}
                    />
                    {errors.unit && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.unit.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="Enter description (optional)"
                    {...register("description")}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1">
                    {editingIngredient
                      ? "Update Ingredient"
                      : "Create Ingredient"}
                  </Button>
                  {editingIngredient && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {ingredients && ingredients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>All Ingredients</CardTitle>
              <CardDescription>
                {ingredients.length} ingredients in your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ingredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="border-b border-muted pb-3 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{ingredient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {ingredient.type} ({ingredient.unit})
                        </div>
                        {ingredient.description && (
                          <div className="text-sm mt-1">
                            {ingredient.description}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(ingredient)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(ingredient.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

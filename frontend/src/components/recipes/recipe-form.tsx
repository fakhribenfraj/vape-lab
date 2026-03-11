import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { recipeSchema, recipeIngredientSchema } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

interface RecipeFormProps {
  onSubmit: (data: {
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
  }) => void;
  onCancel: () => void;
  initialValues?: {
    name?: string;
    description?: string;
    steepingDurationHours?: number;
    targetNicotineMg?: number;
    targetPgRatio?: number;
    targetVgRatio?: number;
  };
}

export default function RecipeForm({ onSubmit, onCancel, initialValues }: RecipeFormProps) {
  const [ingredients, setIngredients] = useState<Array<{
    ingredientId: string;
    targetAmount: number;
    orderIndex: number;
  }>>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      steepingDurationHours: initialValues?.steepingDurationHours || 24,
      targetNicotineMg: initialValues?.targetNicotineMg || 3,
      targetPgRatio: initialValues?.targetPgRatio || 50,
      targetVgRatio: initialValues?.targetVgRatio || 50,
    },
  });

  const handleAddIngredient = () => {
    const newIngredient = {
      ingredientId: '',
      targetAmount: 0,
      orderIndex: ingredients.length,
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: string, value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    };
    setIngredients(newIngredients);
  };

  const onSubmitForm = async (data: {
    name: string;
    description?: string;
    steepingDurationHours: number;
    targetNicotineMg: number;
    targetPgRatio: number;
    targetVgRatio: number;
  }) => {
    const formData = {
      ...data,
      ingredients: ingredients.filter(
        (ingredient) => ingredient.ingredientId && ingredient.targetAmount > 0
      ),
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Recipe Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter recipe name"
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            type="text"
            placeholder="Enter description (optional)"
            {...register('description')}
            className={errors.description ? 'border-destructive' : ''}
          />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="steepingDurationHours">Steeping Duration (hours)</Label>
            <Input
              id="steepingDurationHours"
              type="number"
              placeholder="Enter steeping duration"
              {...register('steepingDurationHours')}
              className={errors.steepingDurationHours ? 'border-destructive' : ''}
            />
            {errors.steepingDurationHours && (
              <p className="text-sm text-destructive mt-1">
                {errors.steepingDurationHours.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="targetNicotineMg">Target Nicotine (mg/ml)</Label>
            <Input
              id="targetNicotineMg"
              type="number"
              placeholder="Enter nicotine strength"
              {...register('targetNicotineMg')}
              className={errors.targetNicotineMg ? 'border-destructive' : ''}
            />
            {errors.targetNicotineMg && (
              <p className="text-sm text-destructive mt-1">
                {errors.targetNicotineMg.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetPgRatio">Target PG Ratio (%)</Label>
            <Input
              id="targetPgRatio"
              type="number"
              placeholder="Enter PG ratio"
              {...register('targetPgRatio')}
              className={errors.targetPgRatio ? 'border-destructive' : ''}
            />
            {errors.targetPgRatio && (
              <p className="text-sm text-destructive mt-1">
                {errors.targetPgRatio.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="targetVgRatio">Target VG Ratio (%)</Label>
            <Input
              id="targetVgRatio"
              type="number"
              placeholder="Enter VG ratio"
              {...register('targetVgRatio')}
              className={errors.targetVgRatio ? 'border-destructive' : ''}
            />
            {errors.targetVgRatio && (
              <p className="text-sm text-destructive mt-1">
                {errors.targetVgRatio.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Ingredients</Label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="grid grid-cols-3 gap-2">
              <Input
                type="text"
                placeholder="Ingredient ID"
                value={ingredient.ingredientId}
                onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={ingredient.targetAmount}
                onChange={(e) => handleIngredientChange(index, 'targetAmount', Number(e.target.value))}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveIngredient(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAddIngredient}>
            Add Ingredient
          </Button>
        </div>

        <div className="flex space-x-3">
          <Button type="submit" className="flex-1">
            {initialValues ? 'Update Recipe' : 'Create Recipe'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}

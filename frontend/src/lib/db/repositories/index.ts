import { RecipeService, IngredientService } from "@/lib/db/repositories/recipe";
import { SupplierService } from "@/lib/db/repositories/supplier";
import { PurchaseOrderService, PurchaseOrderItemService } from "@/lib/db/repositories/purchase-order";

export const recipeService = new RecipeService();
export const ingredientService = new IngredientService();
export const supplierService = new SupplierService();
export const purchaseOrderService = new PurchaseOrderService();
export const purchaseOrderItemService = new PurchaseOrderItemService();

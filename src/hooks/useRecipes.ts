import { useEffect, useState } from "react";
import type { NewRecipe, Recipe } from "../types/recipe";
import { createRecipe, getAllRecipes, updateRecipe, deleteRecipe } from "../services/recipeService";
import { storageService } from "../services/storageService";

// Custom hook for loading and managing all recipes
export function useRecipes() {
  // Stores all recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Loads all recipes
  async function loadRecipes() {
    setLoading(true);
    setError("");

    const { data, error } = await getAllRecipes();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setRecipes(data as Recipe[] ?? []);
    setLoading(false);
  }

  // Reload recipes on mount
  useEffect(() => {
    loadRecipes();
  }, []);

  // Adds a new recipe
  async function addRecipe(recipe: NewRecipe) {
    clearMessages();
    const { error } = await createRecipe(recipe);

    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Recipe added successfully.");
    await loadRecipes();
    return true;
  }

  // Updates an existing recipe
  async function editRecipe(recipeId: number, updatedData: Partial<NewRecipe>) {
    clearMessages();
    const { error } = await updateRecipe(recipeId, updatedData);

    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Recipe updated successfully.");
    await loadRecipes();
    return true;
  }

  // Deletes a recipe
  async function removeRecipe(recipeId: number) {
    clearMessages();
    const recipeToDelete = recipes.find(r => r.id === recipeId);

    if (recipeToDelete?.image_path) {
      const { error: storageError } = await storageService.deleteImage(recipeToDelete.image_path);
      if (storageError) {
        console.error("Failed to delete image from storage:", storageError.message);
      }
    }

    const { error } = await deleteRecipe(recipeId);
    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Recipe and associated image deleted successfully.");
    await loadRecipes();
    return true;
  }

  // Helper to clear messages
  function clearMessages() {
    setError("");
    setSuccessMessage("");
  }

  return {
    recipes,
    loading,
    error,
    successMessage,
    addRecipe,
    editRecipe,
    removeRecipe,
    refreshRecipes: loadRecipes,
    clearMessages,
  };
}


export type Recipe = { 
  id: number; 
  title: string; 
  description: string; 
  prep_time: number; 
  category_id: number; 
  user_id: string; 
  owner_email: string; 
  created_at?: string; 
  image_path?: string;
}

export type NewRecipe = {
  title: string; 
  description: string; 
  prep_time: number; 
  category_id: number; 
  user_id: string; 
  owner_email: string;
  image_path?: string; 
}

export type RecipeFormData = {
  title: string; 
  description: string; 
  prep_time: number | string; 
  category_id: string;
  image?: File | null; 
}
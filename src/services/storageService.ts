import { supabase } from "../lib/supabaseClient";

const BUCKET_NAME = 'recipe-images';

export const storageService = {

  async uploadRecipeImage(file: File, userId: string) {
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);

    return { data, error };
  },

  getPublicUrl(path: string) {
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);
      
    return data.publicUrl;
  },

  async deleteImage(path: string) {
    return await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);
  }
};
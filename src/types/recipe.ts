export interface Ingredient {
  name: string;
  measure: string;
}

export interface RecipeSummary {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
}

export interface RecipeDetails extends RecipeSummary {
  area: string;
  instructions: string;
  ingredients: Ingredient[];
  sourceUrl?: string;
  youtubeUrl?: string;
}

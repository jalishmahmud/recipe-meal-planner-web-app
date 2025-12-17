import type { RecipeDetails, RecipeSummary, Ingredient } from "../types/recipe";

type MealDbMeal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strSource: string | null;
  strYoutube: string | null;
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
};

export function toSummary(meal: MealDbMeal): RecipeSummary {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    thumbnail: meal.strMealThumb,
    category: meal.strCategory ?? "Unknown",
  };
}

export function toDetails(meal: MealDbMeal): RecipeDetails {
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];

    const name = (ing ?? "").trim();
    const measure = (meas ?? "").trim();

    if (name.length > 0) {
      ingredients.push({ name, measure });
    }
  }

  return {
    ...toSummary(meal),
    area: meal.strArea ?? "Unknown",
    instructions: (meal.strInstructions ?? "").trim(),
    ingredients,
    sourceUrl: meal.strSource ?? undefined,
    youtubeUrl: meal.strYoutube ?? undefined,
  };
}

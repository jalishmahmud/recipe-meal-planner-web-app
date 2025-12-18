import type { RecipeDetails, RecipeSummary, Ingredient } from "../types/recipe";

import type { SearchRes } from "../types/commonTypes";

type SearchMeal = NonNullable<SearchRes["meals"]>[number];

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

export function toSummary(m: SearchMeal): RecipeSummary {
  return {
    id: m.idMeal,
    name: m.strMeal,
    thumbnail: m.strMealThumb,
    category: m.strCategory ?? "Unknown",
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

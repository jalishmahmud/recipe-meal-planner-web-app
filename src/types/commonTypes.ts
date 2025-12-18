export type DetailsRes = {
  meals: Array<{
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
  }> | null;
};

export type CategoriesRes = {
  categories: Array<{ strCategory: string }>;
};

export type SearchRes = {
  meals: Array<{
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string | null;
  }> | null;
};

export type FilterRes = {
  meals: Array<{
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
  }> | null;
};

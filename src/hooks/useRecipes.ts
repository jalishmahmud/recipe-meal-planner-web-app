import { useEffect, useState } from "react";
import { apiGet } from "../utils/api";
import { toSummary } from "../utils/mealdbMapper";
import type { RecipeSummary } from "../types/recipe";
import type { CategoriesRes, FilterRes, SearchRes } from "../types/commonTypes";

function mapFilterToSummary(
  meal: FilterRes["meals"][number],
  category: string
): RecipeSummary {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    thumbnail: meal.strMealThumb,
    category,
  };
}

export function useRecipes(searchQuery: string, category: string) {
  const [categories, setCategories] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await apiGet<CategoriesRes>("/categories.php", ac.signal);
        const names = res.categories.map((c) => c.strCategory).filter(Boolean);
        setCategories(names);
      } catch (e) {
        setCategories([]);
      }
    })();
    return () => ac.abort();
  }, []);

  useEffect(() => {
    const q = searchQuery.trim();
    const c = category.trim();

    const ac = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        if (c && c !== "All") {
          const res = await apiGet<FilterRes>(
            `/filter.php?c=${encodeURIComponent(c)}`,
            ac.signal
          );
          const list = res.meals
            ? res.meals.map((m) => mapFilterToSummary(m, c))
            : [];
          const filtered = q
            ? list.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()))
            : list;
          setRecipes(filtered);
          return;
        }
        const res = await apiGet<SearchRes>(
          `/search.php?s=${encodeURIComponent(q)}`,
          ac.signal
        );
        const list = res.meals ? res.meals.map((m) => toSummary(m)) : [];
        setRecipes(list);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        const msg = e instanceof Error ? e.message : "Unknown error";
        setError(msg);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [searchQuery, category]);

  return { categories, recipes, loading, error };
}

import { useEffect, useState } from "react";
import { apiGet } from "../utils/api";
import { toDetails } from "../utils/mealdbMapper";
import type { RecipeDetails } from "../types/recipe";
import type { DetailsRes } from "../types/commonTypes";

export function useRecipeDetails(id: string | null) {
  const [details, setDetails] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setDetails(null);
      setLoading(false);
      setError(null);
      return;
    }

    const ac = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await apiGet<DetailsRes>(
          `/lookup.php?i=${encodeURIComponent(id)}`,
          ac.signal
        );
        const meal = res.meals?.[0];
        if (!meal) throw new Error("Recipe not found");
        setDetails(toDetails(meal));
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        const msg = e instanceof Error ? e.message : "Unknown error";
        setError(msg);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [id]);

  return { details, loading, error };
}

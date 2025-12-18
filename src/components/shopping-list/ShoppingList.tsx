import React from "react";
import { apiGet } from "../../utils/api";
import { toDetails } from "../../utils/mealdbMapper";
import type { ShoppingItem } from "../../types/shopping";
import { WEEK } from "../../utils/week";
import type { WeekdayKey } from "../../types/mealPlan";
import { useAppContext } from "../../context/AppContext";
import styles from "./ShoppingList.module.css";
import type { DetailsRes } from "../../types/commonTypes";

function makeKey(
  day: string,
  recipeId: string,
  name: string,
  measure: string
): string {
  return `${day}__${recipeId}__${name}__${measure}`
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function ShoppingList() {
  const { state, dispatch } = useAppContext();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  type PlannedMeal = NonNullable<(typeof state.mealPlan.byDay)[WeekdayKey]>;

  const plannedByDay: Array<{
    dayKey: WeekdayKey;
    dayLabel: string;
    meal: PlannedMeal | null;
  }> = WEEK.map((d) => ({
    dayKey: d.key,
    dayLabel: d.label,
    meal: state.mealPlan.byDay[d.key],
  }));

  const plannedMeals = plannedByDay.filter((x) => x.meal);

  const generate = async () => {
    setLoading(true);
    setError(null);

    try {
      const ids = Array.from(new Set(plannedMeals.map((x) => x.meal!.id)));
      const results = await Promise.all(
        ids.map((id) =>
          apiGet<DetailsRes>(`/lookup.php?i=${encodeURIComponent(id)}`)
        )
      );

      const byId = new Map<string, ReturnType<typeof toDetails>>();
      for (const res of results) {
        const meal = res.meals?.[0];
        if (!meal) continue;
        byId.set(meal.idMeal, toDetails(meal));
      }

      const items: ShoppingItem[] = [];

      for (const row of plannedMeals) {
        const recipeId = row.meal!.id;
        const details = byId.get(recipeId);
        if (!details) continue;

        for (const ing of details.ingredients) {
          items.push({
            key: makeKey(row.dayLabel, recipeId, ing.name, ing.measure),
            day: row.dayLabel,
            recipeId,
            recipeName: details.name,
            name: ing.name,
            measure: ing.measure,
            purchased: false,
          });
        }
      }

      dispatch({ type: "SHOPPING_SET", items, fromIds: ids });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key: string) => dispatch({ type: "SHOPPING_TOGGLE", key });
  const clearPurchased = () => dispatch({ type: "SHOPPING_CLEAR_PURCHASED" });

  const hasItems = state.shopping.items.length > 0;
  const totalRecipes = React.useMemo(() => {
    const ids = new Set(state.shopping.items.map((i) => i.recipeId));
    return ids.size;
  }, [state.shopping.items]);

  const totalItems = state.shopping.items.length;
  const grouped = React.useMemo(() => {
    const dayMap = new Map<string, Map<string, ShoppingItem[]>>();

    for (const it of state.shopping.items) {
      if (!dayMap.has(it.day)) dayMap.set(it.day, new Map());
      const recipeMap = dayMap.get(it.day)!;

      if (!recipeMap.has(it.recipeName)) recipeMap.set(it.recipeName, []);
      recipeMap.get(it.recipeName)!.push(it);
    }

    return dayMap;
  }, [state.shopping.items]);

  return (
    <div className={styles["card"]}>
      <div className={styles["card-header"]}>
        <h2>Shopping list</h2>
        <small>Day → Recipe → Ingredients</small>
      </div>

      <div className={styles["card-body"]}>
        <div className={styles["row"]}>
          <button
            className={`${styles["btn"]} ${styles["btn-primary"]}`}
            onClick={generate}
            disabled={loading || plannedMeals.length === 0}
          >
            {loading ? "Generating…" : "Generate from meal plan"}
          </button>

          <button
            className={`${styles["btn"]} ${styles["btn-ghost"]}`}
            onClick={clearPurchased}
            disabled={!hasItems}
          >
            Clear purchased
          </button>

          <span className={styles["pill"]}>
            Recipes: <b style={{ color: "#fff" }}>{totalRecipes}</b>
          </span>

          <span className={styles["pill"]}>
            Items: <b style={{ color: "#fff" }}>{totalItems}</b>
          </span>
        </div>

        {error && (
          <div
            className={`${styles["alert"]} ${styles["alert-error"]}`}
            style={{ marginTop: 12 }}
          >
            {error}
          </div>
        )}

        {!hasItems && !loading && (
          <div className={styles["alert"]} style={{ marginTop: 12 }}>
            Plan meals first, then generate your shopping list.
          </div>
        )}

        {hasItems && (
          <div className={styles["available-item"]}>
            {[...grouped.entries()].map(([day, recipeMap]) => (
              <div
                key={day}
                className={styles["card"]}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 16,
                }}
              >
                <div className={styles["card-header"]}>
                  <h2>{day}</h2>
                  <small>{recipeMap.size} recipe(s)</small>
                </div>

                <div
                  className={styles["card-body"]}
                  style={{ display: "grid", gap: 12 }}
                >
                  {[...recipeMap.entries()].map(([recipeName, items]) => (
                    <div key={recipeName} className={styles["day-row"]}>
                      <div className={styles["day-rowTop"]}>
                        <strong>{recipeName}</strong>
                        <span className={styles["pill"]}>
                          {items.length} items
                        </span>
                      </div>

                      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                        {items.map((it) => (
                          <div key={it.key} className={styles["shop-item"]}>
                            <div className={styles["shop-left"]}>
                              <input
                                className={styles["checkbox"]}
                                type="checkbox"
                                checked={it.purchased}
                                onChange={() => toggle(it.key)}
                              />
                              <div>
                                <div
                                  className={
                                    it.purchased ? styles["strike"] : ""
                                  }
                                >
                                  <b>{it.name}</b>
                                </div>

                                {it.measure && (
                                  <div
                                    className={
                                      it.purchased
                                        ? `${styles["strike"]} ${styles["muted"]} ${styles["small"]}`
                                        : `${styles["muted"]} ${styles["small"]}`
                                    }
                                  >
                                    {it.measure}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

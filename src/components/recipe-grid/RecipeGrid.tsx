import type { RecipeSummary } from "../../types/recipe";
import styles from "./RecipeGrid.module.css";

export function RecipeGrid({
  recipes,
  loading,
  error,
  onPick,
}: {
  recipes: RecipeSummary[];
  loading: boolean;
  error: string | null;
  onPick: (recipe: RecipeSummary) => void;
}) {
  return (
    <div className={styles["card"]} style={{ marginTop: 14 }}>
      <div className={styles["card-header"]}>
        <h2>Results</h2>
        <small>{loading ? "Loading…" : `${recipes.length} recipes`}</small>
      </div>
      <div className={styles["card-body"]}>
        {error && (
          <div className={`${styles["alert"]} ${styles["alert-error"]}`}>
            {error}
          </div>
        )}

        {!loading && !error && recipes.length === 0 && (
          <div className={styles["alert"]}>
            No recipes found. Try a different keyword, or choose a category like{" "}
            <b>Seafood</b>.
          </div>
        )}

        <div className={styles["recipes-grid"]} style={{ marginTop: 12 }}>
          {recipes.map((r) => (
            <div
              key={r.id}
              className={styles["recipe-card"]}
              onClick={() => onPick(r)}
              role="button"
              tabIndex={0}
            >
              <img
                className={styles["recipe-thumb"]}
                src={r.thumbnail}
                alt={r.name}
                loading="lazy"
              />
              <div className={styles["recipe-meta"]}>
                <h3>{r.name}</h3>
                <p>{r.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

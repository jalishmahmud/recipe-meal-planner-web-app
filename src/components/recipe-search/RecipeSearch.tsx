import styles from "./RecipeSearch.module.css";

export function RecipeSearch({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  categories: string[];
}) {
  return (
    <div className={styles["card"]}>
      <div className={styles["cardHeader"]}>
        <h2>Find recipes</h2>
        <small>Search + filter</small>
      </div>
      <div className={styles["cardBody"]}>
        <div className={styles["row"]}>
          <input
            className={styles["input"]}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by recipe name (e.g., chicken, pasta)"
          />

          <select
            className={styles["select"]}
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="All">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {query.length > 0 && query.length < 3 && (
          <p className={`${styles["muted"]} ${styles["small"]}`}>
            Type at least 3 characters to search
          </p>
        )}
        <p
          className={`${styles["muted"]} ${styles["small"]}`}
          style={{ marginTop: 10 }}
        >
          Tip: Pick a category first for faster browsing.
        </p>
      </div>
    </div>
  );
}

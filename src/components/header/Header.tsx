import styles from "./Header.module.css";

export function Header({
  tab,
  onChange,
}: {
  tab: "planner" | "shopping";
  onChange: (t: "planner" | "shopping") => void;
}) {
  return (
    <div className={styles["header"]}>
      <div className={styles["brand"]}>
        <div className={styles["logo"]} />
        <div className={styles["title"]}>
          <h1>Recipe Meal Planner</h1>
          <p>Search recipes → plan the week → generate shopping list</p>
        </div>
      </div>

      <div className={styles["tabs"]}>
        <button
          className={
            tab === "planner"
              ? `${styles["tabBtn"]} ${styles["tabBtnActive"]}`
              : styles["tabBtn"]
          }
          onClick={() => onChange("planner")}
        >
          Planner
        </button>
        <button
          className={
            tab === "shopping"
              ? `${styles["tabBtn"]} ${styles["tabBtnActive"]}`
              : styles["tabBtn"]
          }
          onClick={() => onChange("shopping")}
        >
          Shopping List
        </button>
      </div>
    </div>
  );
}

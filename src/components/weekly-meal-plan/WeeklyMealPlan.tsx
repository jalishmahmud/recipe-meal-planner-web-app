import type { RecipeSummary } from "../../types/recipe";
import type { WeekdayKey } from "../../types/mealPlan";
import { nextWeekRangeLabel, WEEK } from "../../utils/week";
import styles from "./WeeklyMealPlan.module.css";

export function WeeklyMealPlan({
  plan,
  selectedDay,
  onSelectDay,
  onRemove,
  onOpenDetails,
}: {
  plan: Record<WeekdayKey, RecipeSummary | null>;
  selectedDay: WeekdayKey | null;
  onSelectDay: (d: WeekdayKey | null) => void;
  onRemove: (d: WeekdayKey) => void;
  onOpenDetails: (id: string, summary?: RecipeSummary) => void;
}) {
  return (
    <div className={styles["card"]}>
      <div className={styles["card-header"]}>
        <h2>Weekly plan</h2>
        <small>{nextWeekRangeLabel()}</small>
      </div>

      <div className={styles["card-body"]}>
        <div className={styles["row"]} style={{ marginBottom: 10 }}>
          <span className={styles["pill"]}>
            Click a day → then click a recipe
          </span>
          {selectedDay && (
            <button
              className={`${styles["btn"]} ${styles["btn-ghost"]}`}
              onClick={() => onSelectDay(null)}
            >
              Clear selected day
            </button>
          )}
        </div>

        <div className={styles["day-list"]}>
          {WEEK.map((d) => {
            const meal = plan[d.key];
            const isSelected = selectedDay === d.key;

            return (
              <div key={d.key} className={styles["day-row"]}>
                <div className={styles["day-row-top"]}>
                  <strong>
                    {d.label}{" "}
                    {isSelected && (
                      <span
                        className={styles["pill"]}
                        style={{ marginLeft: 8 }}
                      >
                        Selected
                      </span>
                    )}
                  </strong>

                  <button
                    className={
                      isSelected
                        ? `${styles["btn"]} ${styles["btn-primary"]}`
                        : styles["btn"]
                    }
                    onClick={() => onSelectDay(d.key)}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                </div>

                <div className={styles["day-row-bottom"]}>
                  {meal ? (
                    <>
                      <div className={styles["day-meal"]}>
                        <img src={meal.thumbnail} alt={meal.name} />
                        <div className={styles["name"]}>
                          <b>{meal.name}</b>
                          <span>{meal.category}</span>
                        </div>
                      </div>

                      <div className={styles["row"]}>
                        <button
                          className={styles["btn"]}
                          onClick={() => onOpenDetails(meal.id, meal)}
                        >
                          View
                        </button>
                        <button
                          className={`${styles["btn"]} ${styles["btn-danger"]}`}
                          onClick={() => onRemove(d.key)}
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={`${styles["muted"]} ${styles["small"]}`}>No meal planned yet.</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

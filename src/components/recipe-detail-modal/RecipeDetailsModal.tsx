import { useEffect } from "react";
import type { WeekdayKey } from "../../types/mealPlan";
import { useRecipeDetails } from "../../hooks/useRecipeDetails";
import styles from "./RecipeDetailsModal.module.css";
export function RecipeDetailsModal({
  mealId,
  open,
  onClose,
  selectedDay,
  onAddToDay,
}: {
  mealId: string | null;
  open: boolean;
  onClose: () => void;
  selectedDay: WeekdayKey | null;
  onAddToDay: (
    day: WeekdayKey,
    mealId: string,
    name: string,
    thumb: string,
    category: string
  ) => void;
}) {
  const { details, loading, error } = useRecipeDetails(open ? mealId : null);

  useEffect(() => {
    if (!open) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={styles["modal-backdrop"]}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["modal-head"]}>
          <h3>Recipe details</h3>

          <div className={styles["row"]}>
            {details && selectedDay && (
              <button
                type="button"
                className={`${styles["btn"]} ${styles["btn-success"]}`}
                onClick={() =>
                  onAddToDay(
                    selectedDay,
                    details.id,
                    details.name,
                    details.thumbnail,
                    details.category
                  )
                }
              >
                Add to {selectedDay.toUpperCase()}
              </button>
            )}

            <button
              type="button"
              className={`${styles["btn"]} ${styles["btn-ghost"]}`}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Close
            </button>
          </div>
        </div>

        <div className={styles["modal-body"]}>
          {loading && <div className={styles["alert"]}>Loading recipe…</div>}
          {error && (
            <div className={`${styles["alert"]} ${styles["alert-error"]}`}>
              {error}
            </div>
          )}

          {details && (
            <div className={styles["modal-grid"]}>
              <div>
                <img src={details.thumbnail} alt={details.name} />
                <div className={styles["row"]}>
                  <span className={styles["pill"]}>
                    Category: {details.category}
                  </span>
                  <span className={styles["pill"]}>Area: {details.area}</span>
                </div>
              </div>

              <div>
                <h3 className={styles["details-name"]}>{details.name}</h3>

                <div className={styles["card"]}>
                  <div className={styles["card-header"]}>
                    <h2>Ingredients</h2>
                    <small>{details.ingredients.length} items</small>
                  </div>
                  <div className={styles["card-body"]}>
                    <ul className={styles["list"]}>
                      {details.ingredients.map((i) => (
                        <li key={`${i.name}-${i.measure}`}>
                          <span className={styles["muted"]}>{i.name}</span>
                          {i.measure ? ` — ${i.measure}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ height: 12 }} />

                <div className={styles["card"]}>
                  <div className={styles["card-header"]}>
                    <h2>Instructions</h2>
                    <small>Step-by-step</small>
                  </div>
                  <div className={styles["card-body"]}>
                    <p
                      className={styles["muted"]}
                      style={{
                        whiteSpace: "pre-wrap",
                        margin: 0,
                        lineHeight: 1.55,
                      }}
                    >
                      {details.instructions || "No instructions provided."}
                    </p>
                  </div>
                </div>

                {!selectedDay && (
                  <p
                    className={`${styles["muted"]} ${styles["small"]}`}
                    style={{ marginTop: 10 }}
                  >
                    Select a day in the weekly plan to enable “Add to day”.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

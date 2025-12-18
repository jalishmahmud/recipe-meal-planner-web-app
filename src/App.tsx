import { useState } from "react";
import { useRecipes } from "./hooks/useRecipes";
import { useMealPlan } from "./hooks/useMealPlan";
import type { RecipeSummary } from "./types/recipe";
import { ErrorBoundary } from "./components/error-boundary/ErrorBoundary";
import { Header } from "./components/header/Header";
import { RecipeSearch } from "./components/recipe-search/RecipeSearch";
import { RecipeGrid } from "./components/recipe-grid/RecipeGrid";
import { WeeklyMealPlan } from "./components/weekly-meal-plan/WeeklyMealPlan";
import { ShoppingList } from "./components/shopping-list/ShoppingList";
import { RecipeDetailsModal } from "./components/recipe-detail-modal/RecipeDetailsModal";
import { useDebounce } from "./hooks/useDebounce";
import styles from "./App.module.css";
import type { WeekdayKey } from "./types/mealPlan";

export default function App() {
  return (
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  );
}

function AppShell() {
  const [tab, setTab] = useState<"planner" | "shopping">("planner");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const debouncedQuery = useDebounce(query.length >= 3 ? query : "", 500);

  const { categories, recipes, loading, error } = useRecipes(
    debouncedQuery,
    category
  );

  const {
    mealPlan,
    selectedDay,
    selectDay,
    setMealForDay,
    removeMealForDay,
    detailsMealId,
    openDetails,
    closeDetails,
  } = useMealPlan();

  const [detailsOpen, setDetailsOpen] = useState(false);

  const handlePickRecipe = (r: RecipeSummary) => {
    openDetails(r.id, r);
    setDetailsOpen(true);
  };

  const handleAddToDay = (
    day: WeekdayKey,
    id: string,
    name: string,
    thumb: string,
    cat: string
  ) => {
    setMealForDay(day, { id, name, thumbnail: thumb, category: cat });
    setDetailsOpen(false);
    closeDetails();
  };

  const closeModal = () => {
    setDetailsOpen(false);
    closeDetails();
  };

  return (
    <div className={styles["container"]}>
      <Header tab={tab} onChange={setTab} />

      {tab === "planner" ? (
        <div className={styles["grid"]}>
          <div>
            <RecipeSearch
              query={query}
              onQueryChange={setQuery}
              category={category}
              onCategoryChange={(nextCategory) => {
                setCategory(nextCategory);
                setQuery("");
              }}
              categories={categories}
            />

            <RecipeGrid
              recipes={recipes}
              loading={loading}
              error={error}
              onPick={handlePickRecipe}
            />
          </div>

          <WeeklyMealPlan
            plan={mealPlan}
            selectedDay={selectedDay}
            onSelectDay={selectDay}
            onRemove={removeMealForDay}
            onOpenDetails={(id, summary) => {
              openDetails(id, summary);
              setDetailsOpen(true);
            }}
          />
        </div>
      ) : (
        <div className={styles["grid"]}>
          <div>
            <ShoppingList />
          </div>
          <div className={styles["card"]}>
            <div className={styles["card-header"]}>
              <h2>How it works</h2>
              <small>Quick guide</small>
            </div>
            <div className={styles["card-body"]}>
              <div className={styles["alert"]}>
                <div className={styles["instructions"]}>
                  <b>1)</b> Go to <b>Planner</b> tab and select a day
                  <br />
                  <b>2)</b> Search recipes and click any recipe card
                  <br />
                  <b>3)</b> In details modal click <b>Add to DAY</b>
                  <br />
                  <b>4)</b> Open <b>Shopping List</b> and click <b>Generate</b>
                </div>
              </div>
              <hr className={styles["hr"]} />
              <p
                className={`${styles["muted"]} ${styles["small"]}`}
                style={{ margin: 0 }}
              >
                Meal plan + shopping list persist automatically using
                localStorage.
              </p>
            </div>
          </div>
        </div>
      )}

      <RecipeDetailsModal
        mealId={detailsMealId}
        open={detailsOpen}
        onClose={closeModal}
        selectedDay={selectedDay}
        onAddToDay={handleAddToDay}
      />
    </div>
  );
}

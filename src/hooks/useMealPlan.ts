import { useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import type { WeekdayKey } from "../types/mealPlan";
import type { RecipeSummary } from "../types/recipe";

export function useMealPlan() {
  const { state, dispatch } = useAppContext();

  const selectDay = useCallback(
    (day: WeekdayKey | null) => dispatch({ type: "PLAN_SELECT_DAY", day }),
    [dispatch]
  );

  const setMealForDay = useCallback(
    (day: WeekdayKey, meal: RecipeSummary) =>
      dispatch({ type: "PLAN_SET_MEAL", day, meal }),
    [dispatch]
  );

  const removeMealForDay = useCallback(
    (day: WeekdayKey) => dispatch({ type: "PLAN_REMOVE_MEAL", day }),
    [dispatch]
  );

  const openDetails = useCallback(
    (id: string, summary?: RecipeSummary) =>
      dispatch({ type: "DETAILS_OPEN", id, summary }),
    [dispatch]
  );

  const closeDetails = useCallback(
    () => dispatch({ type: "DETAILS_CLOSE" }),
    [dispatch]
  );

  return {
    mealPlan: state.mealPlan.byDay,
    selectedDay: state.ui.selectedDay as WeekdayKey | null,
    selectDay,
    setMealForDay,
    removeMealForDay,
    detailsMealId: state.ui.detailsMealId,
    openDetails,
    closeDetails,
  };
}

import React from "react";
import { AppContext } from "./AppContext";
import { initialState, STORAGE_KEYS, type AppState } from "./AppState";
import { reducer } from "./reducer";
import { loadJSON, saveJSON } from "../utils/storage";

type Persisted = Pick<AppState, "mealPlan" | "shopping">;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const persisted = loadJSON<Persisted>(STORAGE_KEYS.mealPlan, {
    mealPlan: initialState.mealPlan,
    shopping: initialState.shopping,
  });

  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    ...persisted,
  });

  React.useEffect(() => {
    saveJSON(STORAGE_KEYS.mealPlan, {
      mealPlan: state.mealPlan,
      shopping: state.shopping,
    });
  }, [state.mealPlan, state.shopping]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

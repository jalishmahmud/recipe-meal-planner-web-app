import React from "react";
import type { AppState, Action } from "./AppState";

export const AppContext = React.createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function useAppContext() {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}

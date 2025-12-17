import type { RecipeSummary } from "./recipe";

export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface MealPlanState {
  byDay: Record<WeekdayKey, RecipeSummary | null>;
}

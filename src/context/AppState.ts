import type { MealPlanState } from "../types/mealPlan";
import type { ShoppingItem } from "../types/shopping";
import type { RecipeSummary } from "../types/recipe";

export interface AppState {
  mealPlan: MealPlanState;
  shopping: {
    items: ShoppingItem[];
    generatedFromMealIds: string[];
  };
  ui: {
    selectedDay: keyof MealPlanState["byDay"] | null;
    detailsMealId: string | null;
    lastViewedSummary: RecipeSummary | null;
  };
}

export type Action =
  | { type: "PLAN_SELECT_DAY"; day: keyof MealPlanState["byDay"] | null }
  | { type: "PLAN_SET_MEAL"; day: keyof MealPlanState["byDay"]; meal: RecipeSummary }
  | { type: "PLAN_REMOVE_MEAL"; day: keyof MealPlanState["byDay"] }
  | { type: "DETAILS_OPEN"; id: string; summary?: RecipeSummary | null }
  | { type: "DETAILS_CLOSE" }
  | { type: "SHOPPING_SET"; items: ShoppingItem[]; fromIds: string[] }
  | { type: "SHOPPING_TOGGLE"; key: string }
  | { type: "SHOPPING_CLEAR_PURCHASED" }
  | { type: "RESET_ALL" };

export const STORAGE_KEYS = {
  mealPlan: "rmp_mealplan_v1",
  shopping: "rmp_shopping_v1",
};

export const initialState: AppState = {
  mealPlan: {
    byDay: {
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null,
      sat: null,
      sun: null,
    },
  },
  shopping: {
    items: [],
    generatedFromMealIds: [],
  },
  ui: {
    selectedDay: null,
    detailsMealId: null,
    lastViewedSummary: null,
  },
};

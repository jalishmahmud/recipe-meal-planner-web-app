import type { AppState, Action } from "./AppState";

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "PLAN_SELECT_DAY":
      return { ...state, ui: { ...state.ui, selectedDay: action.day } };

    case "PLAN_SET_MEAL":
      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          byDay: { ...state.mealPlan.byDay, [action.day]: action.meal },
        },
      };

    case "PLAN_REMOVE_MEAL":
      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          byDay: { ...state.mealPlan.byDay, [action.day]: null },
        },
      };

    case "DETAILS_OPEN":
      return {
        ...state,
        ui: {
          ...state.ui,
          detailsMealId: action.id,
          lastViewedSummary: action.summary ?? state.ui.lastViewedSummary,
        },
      };

    case "DETAILS_CLOSE":
      return { ...state, ui: { ...state.ui, detailsMealId: null } };

    case "SHOPPING_SET":
      return {
        ...state,
        shopping: {
          items: action.items,
          generatedFromMealIds: action.fromIds,
        },
      };

    case "SHOPPING_TOGGLE":
      return {
        ...state,
        shopping: {
          ...state.shopping,
          items: state.shopping.items.map((it) =>
            it.key === action.key ? { ...it, purchased: !it.purchased } : it
          ),
        },
      };

    case "SHOPPING_CLEAR_PURCHASED":
      return {
        ...state,
        shopping: {
          ...state.shopping,
          items: state.shopping.items.filter((it) => !it.purchased),
        },
      };

    case "RESET_ALL":
      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          byDay: {
            mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null,
          },
        },
        shopping: { items: [], generatedFromMealIds: [] },
        ui: { ...state.ui, selectedDay: null, detailsMealId: null, lastViewedSummary: null },
      };

    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}

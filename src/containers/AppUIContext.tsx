import React, { useContext, useReducer, createContext } from "react";
import { INITIAL_UI_STATE } from "../constants/config/UI";
import { Dispatch, UIState, Action } from "./@types/UIState";

const AppUIStateContext = createContext<{
  UIState: UIState;
  dispatch: Dispatch;
}>({
  UIState: INITIAL_UI_STATE,
  dispatch: () => null,
});

const UIStateReducer = (UIState: UIState, action: Action): UIState => {
  switch (action.type) {
    case "TOGGLE_UI_VISIBILITY":
      return {
        ...UIState,
        UIHidden: !UIState.UIHidden,
      };
    default:
      return UIState;
  }
};

export const AppUIStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [UIState, dispatch] = useReducer(UIStateReducer, INITIAL_UI_STATE);

  return (
    <AppUIStateContext.Provider value={{ UIState, dispatch }}>
      {children}
    </AppUIStateContext.Provider>
  );
};

export const useAppUIState = () => {
  const context = useContext(AppUIStateContext);

  if (!context)
    throw new Error("useAppUIState must be used within an AppUIStateProvider");

  return context;
};

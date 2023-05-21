import { INITIAL_UI_STATE } from "../../constants/config/UI";

export type UIState = typeof INITIAL_UI_STATE;
export type Dispatch = (v: Action) => void;

export type TOGGLE_UI_VISIBILITYAction = {
  type: "TOGGLE_UI_VISIBILITY";
};

export type Action = TOGGLE_UI_VISIBILITYAction;

export type Dispatch = (val: Action) => void;

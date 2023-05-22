import { INITIAL_UI_STATE } from "../../constants/config/UI";

export type UIState = typeof INITIAL_UI_STATE;
export type Dispatch = (v: Action) => void;

export type TOGGLE_UI_VISIBILITYAction = {
  type: "TOGGLE_UI_VISIBILITY";
};

export type SET_ENVIROMENT_DATAAction = {
  type: "SET_ENVIROMENT_DATA";
  payload: PublicEnvironmentData;
};

export type Action = TOGGLE_UI_VISIBILITYAction | SET_ENVIROMENT_DATAAction;

export type Dispatch = (val: Action) => void;

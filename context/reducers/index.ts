import { combineReducers } from "redux";
import { userAuthReducer } from "./userAuthReducer";

const reducer = combineReducers({
  user: userAuthReducer,
});

export default reducer;

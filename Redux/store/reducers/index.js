import { combineReducers } from "redux";
import { userReducer } from "./user";
import { extraReducer } from "./extra";

export default combineReducers({
  user: userReducer,
  extra: extraReducer,
});

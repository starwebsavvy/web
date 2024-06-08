import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import { createStore, applyMiddleware } from "redux";

const logger = (store) => (next) => (action) => {
  console.log("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  return result;
};

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger))
);

export default store;

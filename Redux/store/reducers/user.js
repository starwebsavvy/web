import { USER_DEC, USER_INC } from "../actions";

const initialState = {
  cnt: 4,
};

export const userReducer = (state = initialState, action) => {
  let num;
  switch (action.type) {
    case USER_INC:
      console.log("Reducer call.");
      num = state.cnt + 1;
      return { ...state, cnt: num };
    case USER_DEC:
      num = state.cnt - 1;
      return { ...state, cnt: num };
    default:
      return state;
  }
};

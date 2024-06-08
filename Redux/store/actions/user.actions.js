export const USER_INC = "user_inc";
export const USER_DEC = "user_dec";

export function userInc() {
  return {
    type: USER_INC,
  };
}
export function userDec() {
  return {
    type: USER_DEC,
  };
}

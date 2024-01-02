export const SET_USER = (user: any) => {
  return {
    type: "SET_USER",
    user: user,
  };
};

export const SET_USER_NULL = () => {
  return {
    type: "SET_USER_NULL",
  };
};

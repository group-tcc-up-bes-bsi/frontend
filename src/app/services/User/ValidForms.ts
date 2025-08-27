export const isLoginValid = (user: string, password: string) => {
  return user.trim().length > 0 && password.trim().length >= 4;
};

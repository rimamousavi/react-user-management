import { createContext, useContext } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserContext = createContext<any>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserService must be used within a UserProvider");
  }

  return context;
};

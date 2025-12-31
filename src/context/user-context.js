import { createContext, useContext } from "react";

export const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserService must be used within a UserProvider");
  }

  return context;
};


import React, { createContext, useContext } from "react";

// Define a minimal User type for now
interface User {
  id: string;
  email?: string;
  [key: string]: any;
}

interface AuthContextValue {
  user: User | null;
}

const AuthContext = createContext<AuthContextValue>({ user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Placeholder: no real auth, always returns null
  const value: AuthContextValue = { user: null };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/** useAuth: returns { user } context value (user is always null for now) */
export function useAuth() {
  return useContext(AuthContext);
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/lib/supabase";

// ---- TYPES ----
interface AuthContextType {
  user: any | null;
  logout: () => Promise<void>;
}

// ---- CONTEXT ----
const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: async () => {},
});

// ---- PROVIDER ----
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);

  // Haal huidige user op
  async function getUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  // Logout functie
  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  // Luister naar login/logout
  useEffect(() => {
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser(); // user wordt direct geüpdatet
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook die overal gebruikt wordt
export function useAuth() {
  return useContext(AuthContext);
}

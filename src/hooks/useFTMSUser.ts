
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  name: string;
}

export function useFTMSUser() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name ?? "User",
        });
      } else {
        setUser(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name ?? "User",
        });
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = useCallback((userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    supabase.auth.signOut();
  }, []);

  return {
    user,
    showAuthModal,
    setShowAuthModal,
    handleAuthSuccess,
    handleLogout,
  };
}

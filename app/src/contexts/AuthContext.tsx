import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthState } from '@/types';
import { getCurrentUser, subscribeToAuthChanges, signOut as supabaseSignOut } from '@/lib/supabase';

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for existing session
    getCurrentUser().then(user => {
      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });
    });

    // Subscribe to auth changes
    const { data: { subscription } } = subscribeToAuthChanges(user => {
      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabaseSignOut();
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const refreshUser = async () => {
    const user = await getCurrentUser();
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
    }));
  };

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

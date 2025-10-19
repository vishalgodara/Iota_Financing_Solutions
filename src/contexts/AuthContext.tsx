import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Initial session check:', session ? 'User found' : 'No user');
      console.log('👤 User:', session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state change:', event, session?.user?.email || 'No user');
      // Ignore SIGNED_IN event during signup process
      if (event === 'SIGNED_IN' && isSigningUp) {
        console.log('⏭️ Ignoring auto-login during signup');
        return;
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isSigningUp]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Set flag to prevent auto-login during signup
      setIsSigningUp(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setIsSigningUp(false);
        return { error };
      }

      // If signup created a session, sign out immediately
      if (data.session) {
        await supabase.auth.signOut();
        // Wait a bit to ensure signOut completes and state updates
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        setIsSigningUp(false);
        console.log('📧 Please check your email to confirm your account');
        return { 
          error: null, 
          message: 'Please check your email to confirm your account before signing in' 
        };
      }

      // Reset flag after signup completes
      setIsSigningUp(false);
      
      // Show success message
      console.log('✅ Sign up successful! User created but not logged in.');
      return { error: null };
    } catch (error) {
      setIsSigningUp(false);
      console.error('❌ Sign up error:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Show success message
      console.log('✅ Sign in successful!', data);
      return { error: null };
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign out error:', error);
      } else {
        console.log('✅ Signed out successfully!');
      }
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
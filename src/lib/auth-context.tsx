'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial session check
  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchAndSetUserProfile(session.user.id);
        }
      } catch (err) {
        console.error('Error checking session', err);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchAndSetUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAndSetUserProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      console.error('Error fetching user profile:', error);
      setUser(null);
      return;
    }

    // Map Supabase snake_case columns back to the camelCase User type expected by the app
    const mappedUser = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      password: '', // We don't store passwords in state anymore
      department: profile.department,
      createdAt: profile.created_at,
      isActive: profile.is_active,
      avatar: profile.avatar || '',
      // Role-specific fields
      studentId: profile.student_id,
      semester: profile.semester,
      enrolledSubjects: profile.enrolled_subjects,
      facultyId: profile.faculty_id,
      designation: profile.designation,
      subjects: profile.teaching_subjects || [],
    } as unknown as User;

    setUser(mappedUser);
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchAndSetUserProfile(data.user.id);
        return { success: true };
      }
      
      return { success: false, error: 'Login failed unexpectedly.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred.' };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('exam_attempt'); // Keep local state cleanups
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

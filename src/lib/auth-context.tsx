'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';
import { insforge } from './insforge';

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

  const fetchAndSetUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await insforge
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.error('Error fetching user profile:', error);
        setUser(null);
        return;
      }

      // Map InsForge database columns to the camelCase User type expected by the app
      const mappedUser = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        password: '',
        department: profile.department,
        createdAt: profile.created_at,
        isActive: profile.is_active,
        avatar: profile.avatar || '',
        // Role-specific fields
        studentId: profile.student_id,
        semester: profile.semester,
        enrolledSubjects: profile.enrolled_subjects || [],
        facultyId: profile.faculty_id,
        designation: profile.designation,
        subjects: profile.teaching_subjects || [],
      } as unknown as User;

      setUser(mappedUser);
    } catch (err) {
      console.error('Error in fetchAndSetUserProfile:', err);
      setUser(null);
    }
  };

  // Initial session check
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data } = await insforge.auth.getCurrentUser();
        if (mounted && data?.user) {
          await fetchAndSetUserProfile(data.user.id);
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initSession();

    // Listen for auth changes
    const unsubscribe = insforge.auth.onAuthStateChange(async (event: any) => {
      if (!mounted) return;
      const currentUser = event?.session?.user || event?.user;
      if (currentUser?.id) {
        await fetchAndSetUserProfile(currentUser.id);
      } else if (event?.event === 'SIGNED_OUT' || event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        await fetchAndSetUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Login failed unexpectedly.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred.' };
    }
  }, []);

  const logout = useCallback(async () => {
    await insforge.auth.signOut();
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

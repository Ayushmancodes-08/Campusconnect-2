
'use client';

import { useState, useEffect } from 'react';
import { StudentService } from '@/lib/db/students';
import type { Student } from '@/lib/db/schema';

export type UserRole = "admin" | "teacher" | "student" | "finance" | "hostel";

const isBrowser = typeof window !== "undefined";

export interface CurrentUser {
  role: UserRole | null;
  email: string | null;
  studentData: Student | null;
  isLoaded: boolean;
}

export function useCurrentUser(): CurrentUser {
  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const loadCurrentUser = async () => {
      // Optimistic load from localStorage
      if (isBrowser) {
        const storedRole = localStorage.getItem("userRole") as UserRole;
        const storedEmail = localStorage.getItem("userEmail");
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (isLoggedIn && storedRole) {
          setRole(storedRole);
          setEmail(storedEmail);
        }
      }

      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();

        if (data.authenticated && data.role) {
          setRole(data.role);
          setEmail(data.email);

          if (data.role === 'student' && data.email) {
            try {
              const student = await StudentService.getByEmail(data.email);
              if (student) {
                setStudentData(student);
              }
            } catch (error) {
              console.error('useCurrentUser - Error fetching student data:', error);
            }
          }
        } else {
          // If server says not authenticated, clear optimistic state
          setRole(null);
          setEmail(null);
          setStudentData(null);
          if (isBrowser) {
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("isLoggedIn");
          }
        }
      } catch (error) {
        console.error('useCurrentUser - Error verifying session:', error);
      } finally {
        setIsLoaded(true);
      }
    };


    loadCurrentUser();
  }, []);

  return { role, email, studentData, isLoaded };
}

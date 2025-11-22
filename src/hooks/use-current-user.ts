
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
      if (isBrowser) {
        const storedRole = localStorage.getItem("userRole") as UserRole;
        const storedEmail = localStorage.getItem("userEmail");
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        console.log('useCurrentUser - Loading:', { storedRole, storedEmail, isLoggedIn });

        if (isLoggedIn && storedRole) {
          setRole(storedRole);
          setEmail(storedEmail);

          // If student role, fetch student data from Supabase
          if (storedRole === 'student' && storedEmail) {
            try {
              console.log('useCurrentUser - Fetching student data for email:', storedEmail);
              const student = await StudentService.getByEmail(storedEmail);
              console.log('useCurrentUser - Fetched student:', student);
              if (student) {
                setStudentData(student);
              } else {
                console.warn('useCurrentUser - Student not found in Supabase for email:', storedEmail);
              }
            } catch (error) {
              console.error('useCurrentUser - Error fetching student data:', error);
            }
          }
        } else {
          setRole(null);
          setEmail(null);
          setStudentData(null);
        }
      }
      setIsLoaded(true);
    };

    loadCurrentUser();
  }, []);

  return { role, email, studentData, isLoaded };
}

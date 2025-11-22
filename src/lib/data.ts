
import type { UserRole } from "@/hooks/use-current-user";
import type { Student, Staff, Course, Holiday } from "@/lib/db/schema";

// Re-export database types for backward compatibility
export type { Student, Staff, Course, Holiday };

/**
 * Static user profile data
 * Not database-dependent - used for UI display purposes
 */
export const userProfiles: Record<UserRole, { name: string; email: string; avatar: string }> = {
  admin: {
    name: "Admin User",
    email: "admin@campus.edu",
    avatar: "/avatars/01.png",
  },
  teacher: {
    name: "Ayushman Patra",
    email: "osahoo225@gmail.com",
    avatar: "/avatars/02.png",
  },
  student: {
    name: "Om Sahoo",
    email: "osahoo9178@gmail.com",
    avatar: "/avatars/03.png",
  },
  finance: {
    name: "Carol White",
    email: "finance@campus.edu",
    avatar: "/avatars/04.png",
  },
  hostel: {
    name: "Henry Cavill",
    email: "hostel@campus.edu",
    avatar: "/avatars/05.png",
  },
};

/**
 * Mock student data for fallback/initialization
 * These are used as defaults when Supabase is unavailable
 */
export const studentsData: Student[] = [
  {
    id: "1",
    name: "Om Sahoo",
    email: "osahoo9178@gmail.com",
    phone: "9876543210",
    gender: "male",
    join_date: "2023-01-15",
    status: "Active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya.sharma@campus.edu",
    phone: "9876543211",
    gender: "female",
    join_date: "2023-02-20",
    status: "Active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Mock staff data for fallback/initialization
 */
export const staffData: Staff[] = [
  {
    id: "1",
    name: "Ayushman Patra",
    email: "osahoo225@gmail.com",
    phone: "9876543220",
    department: "Computer Science",
    status: "Active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@campus.edu",
    phone: "9876543221",
    department: "Mathematics",
    status: "Active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Mock course data for fallback/initialization
 */
export const coursesData: Course[] = [
  {
    id: "1",
    time: "09:00 AM - 10:30 AM",
    class: "CS101",
    location: "Room 101",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    time: "11:00 AM - 12:30 PM",
    class: "MATH201",
    location: "Room 202",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Mock holiday data for fallback/initialization
 */
export const holidays: Holiday[] = [
  {
    id: "1",
    date: "2024-01-26",
    name: "Republic Day",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    date: "2024-03-08",
    name: "Maha Shivaratri",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Mock teacher schedule data
 */
export const teacherScheduleData = [
  { time: "09:00 AM", class: "CS101", location: "101" },
  { time: "11:00 AM", class: "CS102", location: "102" },
  { time: "02:00 PM", class: "CS201", location: "201" },
];

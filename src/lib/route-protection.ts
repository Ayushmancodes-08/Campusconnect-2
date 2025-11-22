import type { UserRole } from "@/hooks/use-current-user";

/**
 * Route Protection Configuration
 * Defines which roles can access which routes
 */

export const routePermissions: Record<string, UserRole[]> = {
  // Dashboard
  "/dashboard": ["admin", "teacher", "student", "finance", "hostel"],

  // Admin-only routes
  "/dashboard/applications": ["admin"],
  "/dashboard/admissions": ["admin"],
  "/dashboard/staff": ["admin"],
  "/dashboard/students": ["admin", "teacher"],

  // Teacher routes
  "/dashboard/courses": ["admin", "teacher", "student"],
  "/dashboard/attendance": ["admin", "teacher"],
  "/dashboard/grades": ["admin", "teacher", "student"],

  // Finance routes
  "/dashboard/finance": ["admin", "finance", "student"],
  "/dashboard/pay-fee": ["student"],

  // Hostel routes
  "/dashboard/rooms": ["admin", "hostel"],
  "/dashboard/hostel-students": ["admin", "hostel"],
  "/dashboard/mess": ["admin", "hostel"],

  // Holiday management
  "/dashboard/holidays": ["admin"],

  // Settings (accessible to all)
  "/dashboard/settings": ["admin", "teacher", "student", "finance", "hostel"],
};

/**
 * Check if a role has access to a route
 */
export function hasRouteAccess(role: UserRole | null, pathname: string): boolean {
  if (!role) return false;

  // Find matching route pattern
  for (const [route, allowedRoles] of Object.entries(routePermissions)) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      return allowedRoles.includes(role);
    }
  }

  // If route not found in permissions, deny access
  return false;
}

/**
 * Get the default dashboard route for a role
 */
export function getDefaultDashboardRoute(role: UserRole): string {
  const defaultRoutes: Record<UserRole, string> = {
    admin: "/dashboard/applications",
    teacher: "/dashboard/courses",
    student: "/dashboard",
    finance: "/dashboard/finance",
    hostel: "/dashboard/rooms",
  };

  return defaultRoutes[role] || "/dashboard";
}

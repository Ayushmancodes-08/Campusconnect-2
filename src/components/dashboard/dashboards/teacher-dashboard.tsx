
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Book, Users } from "lucide-react";
import { userProfiles, coursesData as defaultCoursesData } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { CourseService } from "@/lib/db/courses";
import type { Course } from "@/lib/db/schema";

export function TeacherDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await CourseService.getAll();
      setCourses(data);
    } catch (error) {
      console.error("Failed to load courses from Supabase", error);
      // Fallback to default data if Supabase fails
      setCourses(defaultCoursesData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight font-headline">Welcome, {userProfiles.teacher.name}!</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next class at 09:00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Courses</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">for this semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">across all courses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Schedule</CardTitle>
              <CardDescription>Your classes for today.</CardDescription>
            </div>
             <Button asChild variant="secondary" size="sm">
                <Link href="/dashboard/courses">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading courses...</p>
            ) : courses.length > 0 ? (
              courses.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{item.class}</p>
                    <p className="text-sm text-muted-foreground">{item.time} &middot; {item.location}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No courses assigned.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { holidays as defaultHolidays } from "@/lib/data";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { HolidayService } from "@/lib/db/holidays"
import type { Holiday as DBHoliday } from "@/lib/db/schema"

type Holiday = {
    id?: string;
    date: string;
    name: string;
    created_at?: string;
    updated_at?: string;
};

export function HolidayManager() {
    const { toast } = useToast();
    const { role } = useCurrentUser();
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [newHolidayName, setNewHolidayName] = useState("");
    const [newHolidayDate, setNewHolidayDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const loadHolidays = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await HolidayService.getAll();
            setHolidays(data);
        } catch (error) {
            console.error("Failed to load holidays from Supabase", error);
            // Fallback to default data if Supabase fails
            setHolidays(defaultHolidays);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load holidays. Using cached data.",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadHolidays();
    }, [loadHolidays]);

    const handleAddHoliday = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHolidayName || !newHolidayDate) {
            toast({ variant: "destructive", title: "Missing Information", description: "Please provide both a name and a date." });
            return;
        }

        try {
            const newHoliday = await HolidayService.create({ date: newHolidayDate, name: newHolidayName });
            const updatedHolidays = [...holidays, newHoliday].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            setHolidays(updatedHolidays);
            setNewHolidayName("");
            setNewHolidayDate("");
            toast({ title: "Holiday Added", description: `${newHolidayName} has been added to the calendar.` });
        } catch (error) {
            console.error("Failed to add holiday:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add holiday.",
            });
        }
    };

    const handleDeleteHoliday = async (holidayId: string | undefined) => {
        if (!holidayId) {
            toast({ variant: "destructive", title: "Error", description: "Holiday ID is missing." });
            return;
        }

        try {
            await HolidayService.delete(holidayId);
            const updatedHolidays = holidays.filter(holiday => holiday.id !== holidayId);
            
            setHolidays(updatedHolidays);
            toast({ variant: "destructive", title: "Holiday Removed", description: "The holiday has been removed." });
        } catch (error) {
            console.error("Failed to delete holiday:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete holiday.",
            });
        }
    };
    
    if (role !== 'admin') {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Permission Denied</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You do not have permission to view this page.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Holiday</CardTitle>
                    <CardDescription>Add a new holiday to the academic calendar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddHoliday} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="holiday-name">Holiday Name</Label>
                            <Input
                                id="holiday-name"
                                value={newHolidayName}
                                onChange={(e) => setNewHolidayName(e.target.value)}
                                placeholder="e.g., Summer Break"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="holiday-date">Date</Label>
                            <Input
                                id="holiday-date"
                                type="date"
                                value={newHolidayDate}
                                onChange={(e) => setNewHolidayDate(e.target.value)}
                            />
                        </div>
                        <Button type="submit">Add Holiday</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Holiday List</CardTitle>
                    <CardDescription>Current list of all official holidays.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {holidays.length > 0 ? (
                                    holidays.map((holiday) => (
                                        <TableRow key={holiday.date}>
                                            <TableCell>{new Date(holiday.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' })}</TableCell>
                                            <TableCell className="font-medium">{holiday.name}</TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                     <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the holiday.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteHoliday(holiday.id)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">No holidays have been added.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

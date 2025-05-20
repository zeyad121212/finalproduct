import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SmartCalendar from "@/components/dashboard/SmartCalendar";

const CalendarPage = () => {
  // Mock user role - in a real app, this would come from auth context
  const userRole = "DV";
  const region = "Cairo";
  const department = "IT";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Training Calendar</h1>
        <p className="text-muted-foreground">
          View and manage all training sessions in one place.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Smart Calendar</CardTitle>
          <CardDescription>
            Your personalized view of training events based on your role and
            region.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <SmartCalendar
            userRole={userRole}
            region={region}
            department={department}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, addDays, isSameDay } from "date-fns";
import {
  CalendarIcon,
  Filter,
  RefreshCw,
  MapPin,
  Users,
  Clock,
  Calendar as CalendarIcon2,
} from "lucide-react";

interface TrainingEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  status: "pending" | "approved" | "completed" | "cancelled";
  trainees: number;
  duration: string;
  trainer?: string;
}

interface SmartCalendarProps {
  userRole?: "DV" | "CC" | "PM" | "SV" | "TR" | "MB";
  region?: string;
  department?: string;
}

const SmartCalendar: React.FC<SmartCalendarProps> = ({
  userRole = "DV",
  region = "Cairo",
  department = "IT",
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [filterRegion, setFilterRegion] = useState<string>(region);
  const [filterDepartment, setFilterDepartment] = useState<string>(department);

  // Mock training events
  const mockEvents: TrainingEvent[] = [
    {
      id: "1",
      title: "Web Development Basics",
      date: new Date(),
      location: "Cairo HQ",
      status: "approved",
      trainees: 15,
      duration: "3 hours",
      trainer: "Ahmed Hassan",
    },
    {
      id: "2",
      title: "Leadership Workshop",
      date: addDays(new Date(), 2),
      location: "Alexandria Branch",
      status: "pending",
      trainees: 20,
      duration: "4 hours",
    },
    {
      id: "3",
      title: "Project Management",
      date: addDays(new Date(), -1),
      location: "Cairo HQ",
      status: "completed",
      trainees: 12,
      duration: "6 hours",
      trainer: "Layla Mahmoud",
    },
    {
      id: "4",
      title: "Communication Skills",
      date: addDays(new Date(), 5),
      location: "Giza Branch",
      status: "approved",
      trainees: 25,
      duration: "2 hours",
      trainer: "Omar Khaled",
    },
    {
      id: "5",
      title: "Data Analysis",
      date: addDays(new Date(), 7),
      location: "Online",
      status: "pending",
      trainees: 30,
      duration: "5 hours",
    },
  ];

  // Filter events based on user role
  const getFilteredEvents = () => {
    let filtered = [...mockEvents];

    // Role-based filtering
    switch (userRole) {
      case "DV":
        filtered = filtered.filter((event) => event.location.includes(region));
        break;
      case "CC":
      case "PM":
        // All events visible but can be filtered
        filtered = filtered.filter(
          (event) =>
            filterRegion === "All" || event.location.includes(filterRegion),
        );
        break;
      case "SV":
        filtered = filtered.filter((event) => event.location.includes(region));
        break;
      case "TR":
        filtered = filtered.filter((event) => event.trainer === "Ahmed Hassan"); // Mock trainer name
        break;
      case "MB":
        // Board members see all events
        break;
    }

    // Additional filters
    if (filterDepartment !== "All") {
      // In a real app, events would have department info
      // This is just a placeholder filter
      filtered = filtered.filter((_, index) => index % 2 === 0);
    }

    return filtered;
  };

  const filteredEvents = getFilteredEvents();

  // Get events for selected date
  const getEventsForSelectedDate = () => {
    if (!date) return [];
    return filteredEvents.filter((event) => isSameDay(event.date, date));
  };

  const selectedDateEvents = getEventsForSelectedDate();

  // Get status badge color
  const getStatusColor = (status: TrainingEvent["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };

  // Get statistics for board members
  const getStatistics = () => {
    return {
      total: mockEvents.length,
      pending: mockEvents.filter((e) => e.status === "pending").length,
      approved: mockEvents.filter((e) => e.status === "approved").length,
      completed: mockEvents.filter((e) => e.status === "completed").length,
      cancelled: mockEvents.filter((e) => e.status === "cancelled").length,
    };
  };

  const stats = getStatistics();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full h-full">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left side - Calendar */}
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Training Calendar</CardTitle>
                  <CardDescription>
                    {userRole === "TR"
                      ? "Your scheduled trainings"
                      : "View and manage training events"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Tabs
                    defaultValue="month"
                    onValueChange={(v) => setView(v as any)}
                  >
                    <TabsList>
                      <TabsTrigger value="month">Month</TabsTrigger>
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="day">Day</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-3/4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="w-full md:w-1/4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Filter by Region
                      </h3>
                      <Select
                        value={filterRegion}
                        onValueChange={setFilterRegion}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Regions</SelectItem>
                          <SelectItem value="Cairo">Cairo</SelectItem>
                          <SelectItem value="Alexandria">Alexandria</SelectItem>
                          <SelectItem value="Giza">Giza</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Filter by Department
                      </h3>
                      <Select
                        value={filterDepartment}
                        onValueChange={setFilterDepartment}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Departments</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setFilterRegion("All");
                        setFilterDepartment("All");
                      }}
                    >
                      <Filter className="mr-2 h-4 w-4" /> Reset Filters
                    </Button>
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="mr-2 h-4 w-4" /> Sync with Google
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Events for selected date */}
        <div className="w-full md:w-1/3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
              </CardTitle>
              <CardDescription>
                {selectedDateEvents.length} training event
                {selectedDateEvents.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {selectedDateEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden">
                        <div
                          className={`h-1 ${event.status === "approved" ? "bg-green-500" : event.status === "pending" ? "bg-yellow-500" : event.status === "completed" ? "bg-blue-500" : "bg-red-500"}`}
                        ></div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge className={getStatusColor(event.status)}>
                              {event.status.charAt(0).toUpperCase() +
                                event.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="mt-2 space-y-1 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4" />
                              {event.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4" />
                              {event.trainees} trainees
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {event.duration}
                            </div>
                            {event.trainer && (
                              <div className="flex items-center">
                                <CalendarIcon2 className="mr-2 h-4 w-4" />
                                Trainer: {event.trainer}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No events</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    There are no training events scheduled for this date.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistics for Board Members */}
      {userRole === "MB" && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Monthly Statistics</CardTitle>
            <CardDescription>
              Training overview for the current month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-bold">{stats.total}</h3>
                <p className="text-sm text-gray-500">Total Trainings</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-bold text-yellow-700">
                  {stats.pending}
                </h3>
                <p className="text-sm text-yellow-600">Pending</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-bold text-green-700">
                  {stats.approved}
                </h3>
                <p className="text-sm text-green-600">Approved</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-bold text-blue-700">
                  {stats.completed}
                </h3>
                <p className="text-sm text-blue-600">Completed</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-bold text-red-700">
                  {stats.cancelled}
                </h3>
                <p className="text-sm text-red-600">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trainer-specific reminders */}
      {userRole === "TR" && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Upcoming Trainings</CardTitle>
            <CardDescription>
              Your scheduled sessions for the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents
                .filter(
                  (event) =>
                    event.date >= new Date() &&
                    event.date <= addDays(new Date(), 7) &&
                    event.status === "approved",
                )
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="bg-primary h-10 w-10 rounded-full flex items-center justify-center text-white mr-4">
                      {format(event.date, "d")}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-500">
                        {format(event.date, "EEEE, MMMM d")} • {event.location}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {event.duration}
                    </Badge>
                  </div>
                ))}
              {filteredEvents.filter(
                (event) =>
                  event.date >= new Date() &&
                  event.date <= addDays(new Date(), 7) &&
                  event.status === "approved",
              ).length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No upcoming trainings in the next 7 days
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartCalendar;

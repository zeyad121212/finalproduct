import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  FileText,
  MessageSquare,
  Users,
  ArrowRight,
} from "lucide-react";
import SmartCalendar from "@/components/dashboard/SmartCalendar";

const Dashboard = () => {
  // Mock user role - in a real app, this would come from auth context
  const userRole = "DV";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your training activities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            New Training Request
          </Button>
          <Button>
            <CalendarIcon className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Trainings
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Trainings
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unread Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">+3 new today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="requests">
            <FileText className="mr-2 h-4 w-4" />
            Recent Requests
          </TabsTrigger>
          <TabsTrigger value="trainers">
            <Users className="mr-2 h-4 w-4" />
            Available Trainers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Calendar</CardTitle>
              <CardDescription>
                View and manage upcoming training sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SmartCalendar userRole={userRole} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="requests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Training Requests</CardTitle>
              <CardDescription>
                Track the status of your training requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock training requests */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <h3 className="font-medium">
                        Leadership Training - Cairo HQ
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Requested on May {10 + i}, 2023
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">
                        {i === 1 ? (
                          <span className="text-yellow-600">
                            Pending Approval
                          </span>
                        ) : i === 2 ? (
                          <span className="text-green-600">Approved</span>
                        ) : (
                          <span className="text-blue-600">Completed</span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trainers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Trainers</CardTitle>
              <CardDescription>
                Find trainers for your upcoming sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Mock trainers */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Trainer {i}</h3>
                      <p className="text-xs text-muted-foreground">
                        {
                          [
                            "Leadership",
                            "Communication",
                            "Technical",
                            "Project Management",
                            "Soft Skills",
                            "Design Thinking",
                          ][i - 1]
                        }{" "}
                        • {4 + (i % 2) / 10}★
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
